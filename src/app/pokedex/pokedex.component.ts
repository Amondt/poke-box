import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReducedPokemon } from '../shared/models/reduced-pokemon.model';
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
                    this.pokedexService.setMovesList(doc.data().list);
                    console.log('moves list updated', doc.data().list);
                }
            }
        );
    };

    ngOnDestroy() {
        this.realtimePokemonsListUnsub();
        this.realtimeMovesListUnsub();
    }
}
