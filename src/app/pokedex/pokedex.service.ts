import { Injectable } from '@angular/core';
import { ReducedPokemon } from '../shared/models/reduced-pokemon.model';
import { ReducedMove } from '../shared/models/reduced-move.model';
import { ReducedAbility } from '../shared/models/reduced-ability.model';
import { Subject } from 'rxjs';
import { PokeapiWrapperService } from '../shared/services/pokeapi-js-wrapper.service';
import { FirebaseService } from '../shared/services/firebase.service';
import { Timestamp } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class PokedexService {
    private pokemonList: ReducedPokemon[] = [];
    pokemonListUpdated = new Subject<ReducedPokemon[]>();

    private movesList: ReducedMove[] = [];
    movesListUpdated = new Subject<ReducedMove[]>();

    private abilitiesList: ReducedAbility[] = [];
    abilitiesListUpdated = new Subject<ReducedAbility[]>();

    pokemonListFirstPartRef = this.firebaseService.createFirebaseRef(
        'pokedex',
        'pokemonReducedListFirstPart'
    );
    pokemonListSecondPartRef = this.firebaseService.createFirebaseRef(
        'pokedex',
        'pokemonReducedListSecondPart'
    );
    pokedexConfigRef = this.firebaseService.createFirebaseRef(
        'pokedex',
        'pokedexConfig'
    );
    movesReducedListRef = this.firebaseService.createFirebaseRef(
        'pokedex',
        'movesReducedList'
    );
    abilitiesReducedListRef = this.firebaseService.createFirebaseRef(
        'pokedex',
        'abilitiesReducedList'
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
    }

    getFullDataFromPokeApi = async () => {
        const pokemonsFinalList = await this.getPokemonsFromPokeApi();
        const movesFinalList = await this.getMovesFromPokeApi();
        const abilitiesFinalList = await this.getAbilitiesFromPokeApi();

        this.updateFirebaseDb(
            pokemonsFinalList,
            movesFinalList,
            abilitiesFinalList
        );
    };

    getAbilitiesFromPokeApi = async () => {
        console.log('getting abilities list');
        const abilitiesList =
            await this.pokeApiWrapperService.getAbilitiesList();

        console.log('getting abilities by name');
        const abilitiesByName =
            await this.pokeApiWrapperService.getAbilityByName(
                abilitiesList.results.map((ability: any) => ability.name)
            );
        return abilitiesByName;
    };

    getMovesFromPokeApi = async () => {
        console.log('getting moves list');
        const movesList = await this.pokeApiWrapperService.getMovesList();

        console.log('getting moves by name');
        const movesByName = await this.pokeApiWrapperService.getMoveByName(
            movesList.results.map((move: any) => move.name)
        );
        return movesByName;
    };

    getPokemonsFromPokeApi = async () => {
        console.log('getting pokemons list');
        const pokemonsList = await this.pokeApiWrapperService.getPokemonsList();

        console.log('getting pokemons by name');
        const pokemonsByName =
            await this.pokeApiWrapperService.getPokemonByName(
                pokemonsList.results.map((pokemon: any) => pokemon.name)
            );

        console.log('getting pokemons by species and by forms');
        const [pokemonsSpeciesByName, pokemonsFormsByName] = await Promise.all([
            this.pokeApiWrapperService.getPokemonSpeciesByName(
                pokemonsByName.map((pokemon: any) => pokemon.species.name)
            ),
            this.pokeApiWrapperService.getPokemonFormByName(
                pokemonsByName.map((pokemon: any) => pokemon.forms[0].name)
            ),
        ]);

        const pokemonsFinalList = pokemonsList.results.map(
            (pokemon: any, index: number) => {
                return {
                    ...pokemonsByName[index],
                    species: pokemonsSpeciesByName[index],
                    forms: pokemonsFormsByName[index],
                };
            }
        );
        return pokemonsFinalList;
    };

    updateFirebaseDb = (
        pokemonsFinalList: any[],
        movesFinalList: any[],
        abilitiesFinalList: any[]
    ) => {
        console.log('updating firebase');

        this.firebaseService.setFirebaseDoc(this.pokedexConfigRef, {
            lastUpdated: Timestamp.now(),
        });

        this.updateFirebasePokemons(pokemonsFinalList);
        this.updateFirebaseMoves(movesFinalList);
        this.updateFirebaseAbilities(abilitiesFinalList);
    };

    updateFirebasePokemons = (pokemonsFinalList: any[]) => {
        const reducedPokemonList = pokemonsFinalList.map((pokemon: any) => {
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
                          singlePokemon.species.name === pokemon.species.name
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

            const abilities = pokemon.abilities.map((ability: any) => {
                return ability.ability.name;
            });

            const moves = pokemon.moves.map((move: any) => {
                return move.move.name;
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
                abilities,
                moves,
                isDefault: pokemon.is_default,
                isBattleOnly: pokemon.forms.is_battle_only,
                isMega: pokemon.forms.is_mega,
                isBaby: pokemon.species.is_baby,
                isLegendary: pokemon.species.is_legendary,
                isMythical: pokemon.species.is_mythical,
            };
        });

        this.firebaseService.setFirebaseDoc(this.pokemonListFirstPartRef, {
            list: reducedPokemonList.slice(0, 500),
        });

        this.firebaseService.setFirebaseDoc(this.pokemonListSecondPartRef, {
            list: reducedPokemonList.slice(500, reducedPokemonList.length),
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

    updateFirebaseMoves = (movesFinalList: any[]) => {
        const reducedMovesList = movesFinalList.map((move: any) => {
            const names = move.names
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

            return {
                name: move.name,
                id: move.id,
                damageClass:
                    move.damage_class !== null ? move.damage_class.name : null,
                names,
            };
        });

        this.firebaseService.setFirebaseDoc(this.movesReducedListRef, {
            list: reducedMovesList,
        });

        movesFinalList.forEach((move: any) => {
            this.firebaseService.setFirebaseDoc(
                this.firebaseService.createFirebaseRef(
                    'pokedex',
                    'movesList',
                    'moves',
                    move.name
                ),
                move
            );
        });
    };

    updateFirebaseAbilities = (abilitiesFinalList: any[]) => {
        let abilitiesFinalSortedList = abilitiesFinalList.filter(
            (ability) => ability.is_main_series
        );
        const reducedAbilitiesList = abilitiesFinalSortedList.map(
            (ability: any) => {
                const names = ability.names
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

                return {
                    name: ability.name,
                    id: ability.id,
                    names,
                };
            }
        );

        this.firebaseService.setFirebaseDoc(this.abilitiesReducedListRef, {
            list: reducedAbilitiesList,
        });

        abilitiesFinalList.forEach((ability: any) => {
            this.firebaseService.setFirebaseDoc(
                this.firebaseService.createFirebaseRef(
                    'pokedex',
                    'abilitiesList',
                    'abilities',
                    ability.name
                ),
                ability
            );
        });
    };

    setPokemonList = (pokemonList: ReducedPokemon[]) => {
        this.pokemonList = pokemonList;
        this.pokemonListUpdated.next(this.pokemonList.slice());
    };

    getPokemonList = (limit = this.pokemonList.length) => {
        return this.pokemonList.slice(0, limit);
    };

    setMovesList = (movesList: ReducedMove[]) => {
        this.movesList = movesList;
        this.movesListUpdated.next(this.movesList.slice());
    };

    getMovesList = () => {
        return this.movesList.slice();
    };

    setAbilitiesList = (abilitiesList: ReducedAbility[]) => {
        this.abilitiesList = abilitiesList;
        this.abilitiesListUpdated.next(this.abilitiesList.slice());
    };

    getAbilitiesList = () => {
        return this.abilitiesList.slice();
    };
}
