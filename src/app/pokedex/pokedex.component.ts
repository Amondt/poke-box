import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReducedPokemon } from '../shared/models/reduced-pokemon.model';
import { ReducedMove } from '../shared/models/reduced-move.model';
import { ReducedAbility } from '../shared/models/reduced-ability.model';
import { FirebaseService } from '../shared/services/firebase.service';
import { PokedexService } from './pokedex.service';
import {
    onSnapshot,
    query,
    collection,
    QuerySnapshot,
    where,
    doc,
    Unsubscribe,
} from 'firebase/firestore';

@Component({
    selector: 'app-pokedex',
    templateUrl: './pokedex.component.html',
    styleUrls: ['./pokedex.component.scss'],
})
export class PokedexComponent implements OnInit, OnDestroy {
    realtimePokemonsListUnsub: Unsubscribe;
    realtimeMovesListUnsub: Unsubscribe;
    realtimeAbilitiesListUnsub: Unsubscribe;

    constructor(
        private pokedexService: PokedexService,
        private firebaseService: FirebaseService
    ) {}

    ngOnInit() {
        this.realtimeDbListen();
    }

    realtimeDbListen = () => {
        this.realtimePokemonsListUnsub = this.firebasePokemonListListen();
        this.realtimeMovesListUnsub = this.firebaseMovesListListen();
        this.realtimeAbilitiesListUnsub = this.firebaseAbilitiesListListen();
    };

    firebasePokemonListListen = () => {
        const q = query(
            collection(this.firebaseService.db, 'pokedex'),
            where('__name__', 'in', [
                'pokemonReducedListFirstPart',
                'pokemonReducedListSecondPart',
            ])
        );
        return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
            let pokemonList: ReducedPokemon[] = [];
            querySnapshot.forEach((doc) => {
                pokemonList.push(...doc.data().list);
            });
            pokemonList = pokemonList.sort(
                (a: ReducedPokemon, b: ReducedPokemon) =>
                    a.order < b.order ? -1 : 1
            );
            this.pokedexService.setPokemonList(pokemonList);
            console.log('pokemons list updated', pokemonList);
        });
    };

    firebaseMovesListListen = () => {
        return onSnapshot(
            doc(this.firebaseService.db, 'pokedex', 'movesReducedList'),
            (doc) => {
                if (doc.exists()) {
                    let movesList: ReducedMove[] = doc
                        .data()
                        .list.sort((a: ReducedMove, b: ReducedMove) =>
                            a.names.find((name) => name.languageCode === 'fr')!
                                .name <
                            b.names.find((name) => name.languageCode === 'fr')!
                                .name
                                ? -1
                                : 1
                        );

                    this.pokedexService.setMovesList(movesList);
                    console.log('moves list updated', movesList);
                }
            }
        );
    };

    firebaseAbilitiesListListen = () => {
        return onSnapshot(
            doc(this.firebaseService.db, 'pokedex', 'abilitiesReducedList'),
            (doc) => {
                if (doc.exists()) {
                    let abilitiesList: ReducedAbility[] = doc
                        .data()
                        .list.sort((a: ReducedAbility, b: ReducedAbility) =>
                            a.names.find((name) => name.languageCode === 'fr')!
                                .name <
                            b.names.find((name) => name.languageCode === 'fr')!
                                .name
                                ? -1
                                : 1
                        );

                    this.pokedexService.setAbilitiesList(abilitiesList);
                    console.log('abilities list updated', abilitiesList);
                }
            }
        );
    };

    ngOnDestroy() {
        this.realtimePokemonsListUnsub();
        this.realtimeMovesListUnsub();
        this.realtimeAbilitiesListUnsub();
    }
}
