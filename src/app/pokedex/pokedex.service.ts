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
                    this.pokeApiWrapperService
                        .getPokemonSpeciesByName(
                            pokemonsByNameRes.map(
                                (pokemon: any) => pokemon.species.name
                            )
                        )
                        .then((pokemonSpeciesByNamesRes) => {
                            console.log('getPokemonSpeciesByName: ok');
                            const pokemonsFinalList =
                                pokemonsListRes.results.map(
                                    (pokemon: any, index: number) => {
                                        return {
                                            ...pokemonsByNameRes[index],
                                            ...pokemonSpeciesByNamesRes[index],
                                        };
                                    }
                                );

                            console.log('final list', pokemonsFinalList);

                            this.updateFirebaseDb(pokemonsFinalList);
                        });
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
                const reducedNames = pokemon.names
                    .filter((name: any) => {
                        return (
                            name.language.name === 'fr' ||
                            name.language.name === 'en'
                        );
                    })
                    .map((name: any) => {
                        return {
                            name: name.name,
                            languageCode: name.language.name,
                        };
                    });

                const reducedStats = pokemon.stats.map((stat: any) => {
                    return {
                        base_stat: stat.base_stat,
                        name: stat.stat.name,
                    };
                });
                const reducedTypes = pokemon.types.map((type: any) => {
                    return type.type.name;
                });

                return {
                    id: pokemon.id,
                    names: reducedNames,
                    icon: pokemon.sprites.versions['generation-viii'].icons
                        .front_default,
                    stats: reducedStats,
                    types: reducedTypes,
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
                console.log('Data changed', doc.data().list);
                this.pokemonList = doc.data().list;
                this.pokemonListUpdated.next(this.pokemonList.slice());
            }
        });
    };

    getPokemonList = () => {
        return this.pokemonList.slice();
    };
}
