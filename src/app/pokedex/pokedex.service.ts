import { Injectable } from '@angular/core';
import { ReducedPokemon } from '../shared/reducedPokemon.model';
import { Subject } from 'rxjs';
import { FirebaseService } from '../shared/firebase.service';
import { Timestamp, onSnapshot } from 'firebase/firestore';

import { PokeapiWrapperService } from '../shared/pokeapi-js-wrapper.service';

@Injectable({ providedIn: 'root' })
export class PokedexService {
    private pokemonList: ReducedPokemon[] = [];
    pokemonListUpdated = new Subject<ReducedPokemon[]>();

    pokemonListRef = this.firebaseService.createFirebaseRef(
        'pokedex',
        'pokemonReducedList'
    );
    pokedexConfigRef = this.firebaseService.createFirebaseRef(
        'pokedex',
        'pokedexConfig'
    );

    constructor(
        private firebaseService: FirebaseService,
        private pokeApiWrapperService: PokeapiWrapperService
    ) {
        this.firebaseService.dbToBeUpdated().then((dbHasToBeUpdated) => {
            if (dbHasToBeUpdated) {
                this.getFullDataFromPokeApi();
            }
        });

        this.realtimeDbListen();
    }

    getFullDataFromPokeApi = () => {
        console.log('get full data from poke api');

        this.pokeApiWrapperService.getPokemonsList().then((pokemonsListRes) => {
            console.log('getPokemonList: ok');

            this.pokeApiWrapperService
                .getPokemonByName(
                    pokemonsListRes.results.map((pokemon: any) => pokemon.name)
                )
                .then((pokemonsByNameRes) => {
                    console.log('getPokemonByName: ok');
                    Promise.all([
                        this.pokeApiWrapperService.getPokemonSpeciesByName(
                            pokemonsByNameRes.map(
                                (pokemon: any) => pokemon.species.name
                            )
                        ),
                        this.pokeApiWrapperService.getPokemonFormByName(
                            pokemonsByNameRes.map(
                                (pokemon: any) => pokemon.forms[0].name
                            )
                        ),
                    ]).then(
                        ([pokemonSpeciesByNamesRes, pokemonFormByNamesRes]) => {
                            console.log('getPokemonSpeciesByName: ok');
                            console.log('getPokemonFormsByName: ok');

                            const pokemonsFinalList =
                                pokemonsListRes.results.map(
                                    (pokemon: any, index: number) => {
                                        return {
                                            ...pokemonsByNameRes[index],
                                            species:
                                                pokemonSpeciesByNamesRes[index],
                                            forms: pokemonFormByNamesRes[index],
                                        };
                                    }
                                );

                            console.log('final list', pokemonsFinalList);

                            this.updateFirebaseDb(pokemonsFinalList);
                        }
                    );
                });
        });
    };

    updateFirebaseDb = (pokemonsFinalList: any[]) => {
        console.log('updating firebase');

        this.firebaseService.setFirebaseDoc(this.pokedexConfigRef, {
            lastUpdated: Timestamp.now(),
        });

        this.firebaseService.setFirebaseDoc(this.pokemonListRef, {
            list: pokemonsFinalList.map((pokemon: any) => {
                const names = pokemon.species.names
                    .filter((name: any) => {
                        return (
                            name.language.name === 'fr' ||
                            name.language.name === 'en' ||
                            name.language.name === 'de' ||
                            name.language.name === 'ja'
                        );
                    })
                    .map((name: any) => {
                        return {
                            name: name.name,
                            languageCode: name.language.name,
                        };
                    });

                const icon = pokemon.sprites.versions['generation-viii'].icons
                    .front_default
                    ? pokemon.sprites.versions['generation-viii'].icons
                          .front_default
                    : pokemonsFinalList.find(
                          (singlePokemon) =>
                              singlePokemon.species.name ===
                              pokemon.species.name
                      ).sprites.versions['generation-viii'].icons.front_default;

                const stats = pokemon.stats.map((stat: any) => {
                    return {
                        base_stat: stat.base_stat,
                        name: stat.stat.name,
                    };
                });
                const types = pokemon.types.map((type: any) => {
                    return type.type.name;
                });

                return {
                    id: pokemon.id,
                    order: pokemon.species.order,
                    name: pokemon.name,
                    names,
                    form: pokemon.forms.form_name,
                    generation: pokemon.species.generation.name,
                    icon,
                    stats,
                    types,
                    isDefault: pokemon.is_default,
                    isBattleOnly: pokemon.forms.is_battle_only,
                    isMega: pokemon.forms.is_mega,
                    isBaby: pokemon.species.is_baby,
                    isLegendary: pokemon.species.is_legendary,
                    isMythical: pokemon.species.is_mythical,
                };
            }),
        });

        pokemonsFinalList.forEach((pokemon: any) => {
            this.firebaseService.setFirebaseDoc(
                this.firebaseService.createFirebaseRef(
                    'pokedex',
                    'pokemonList',
                    'pokemons',
                    pokemon.name
                ),
                pokemon
            );
        });
    };

    realtimeDbListen = () => {
        const realtimeDbSub = onSnapshot(this.pokemonListRef, (doc) => {
            if (doc.exists()) {
                this.pokemonList = doc
                    .data()
                    .list.sort((a: ReducedPokemon, b: ReducedPokemon) =>
                        a.order < b.order ? -1 : 1
                    )
                    .slice(0, 10);
                this.pokemonListUpdated.next(this.pokemonList.slice());
                console.log('Data changed', this.pokemonList);
            }
        });
    };

    getPokemonList = (limit = this.pokemonList.length) => {
        return this.pokemonList.slice(0, limit);
    };
}
