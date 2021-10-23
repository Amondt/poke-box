import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Pokemon } from '../shared/pokemon.model';
import { Subject } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import {
    doc,
    setDoc,
    getDoc,
    Timestamp,
    DocumentReference,
    onSnapshot,
} from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class PokedexService {
    pokeAPIUrl = 'https://pokeapi.co/api/v2/pokemon';
    private pokemonList: Pokemon[] = [];
    pokemonListUpdated = new Subject<Pokemon[]>();

    pokemonListRef = doc(
        this.firebaseService.db,
        'pokedex',
        'rQrAc5UGKSzzc0P60OPt'
    );
    pokedexConfigRef = doc(this.firebaseService.db, 'pokedex', 'pokedexConfig');

    constructor(
        private http: HttpClient,
        private firebaseService: FirebaseService
    ) {
        this.realtimeDbListen();
    }

    dbToBeUpdated = async () => {
        const pokedexConfigRef = doc(
            this.firebaseService.db,
            'pokedex',
            'pokedexConfig'
        );
        // console.log(pokedexConfigRef.);

        const pokedexConfigSnap = await getDoc(pokedexConfigRef);

        if (pokedexConfigSnap.exists()) {
            if (
                Date.now() / 1000 - 60 * 60 * 24 >
                pokedexConfigSnap.data().lastUpdated.seconds
            )
                return true;
            else return false;
        } else {
            return false;
        }
    };

    fetchPokemonList = () => {
        return this.http
            .get<any>(this.pokeAPIUrl + '?limit=1200')
            .pipe(
                map((response) => {
                    return (response.results as Pokemon[]).map((pokemon) => {
                        return {
                            name: pokemon.name,
                            url: pokemon.url,
                        };
                    });
                })
            )
            .subscribe((pokemonList) => {
                this.setFirebaseDoc(this.pokemonListRef, { pokemonList });
                this.setFirebaseDoc(this.pokedexConfigRef, {
                    lastUpdated: Timestamp.now(),
                });
            });
    };

    setFirebaseDoc = async (
        docRef: DocumentReference,
        data: { [key: string]: any }
    ) => {
        try {
            await setDoc(docRef, data);
        } catch (e) {
            console.error('Error updating document: ', e);
        }
    };

    realtimeDbListen = () => {
        const realtimeDbSub = onSnapshot(this.pokemonListRef, (doc) => {
            console.log('Data changed', doc.data());
            if (doc.exists()) {
                this.pokemonList = doc.data().pokemonList;
                this.pokemonListUpdated.next(this.pokemonList.slice());
            }
        });
    };

    getPokemonList = () => {
        return this.pokemonList.slice();
    };
}
