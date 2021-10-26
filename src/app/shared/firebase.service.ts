import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    Timestamp,
    DocumentReference,
    onSnapshot,
} from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
    firebaseConfig = {
        apiKey: 'AIzaSyACZsnpepDd7WXBFNcNCcKROVBCXpp_kQU',
        authDomain: 'poke-box-72040.firebaseapp.com',
        projectId: 'poke-box-72040',
        storageBucket: 'poke-box-72040.appspot.com',
        messagingSenderId: '152396052845',
        appId: '1:152396052845:web:048cddf3771e6bf59c8264',
        measurementId: 'G-HDBCYNXL9Z',
    };
    firebaseApp = initializeApp(this.firebaseConfig);
    db = getFirestore();

    pokedexConfigRef = doc(this.db, 'pokedex', 'pokedexConfig');

    constructor() {}

    dbToBeUpdated = async () => {
        const pokedexConfigSnap = await getDoc(this.pokedexConfigRef);

        if (pokedexConfigSnap.exists()) {
            if (
                Date.now() / 1000 - 60 * 60 * 24 > // if time past is more than 1 day
                pokedexConfigSnap.data().lastUpdated.seconds
            )
                return true;
            else return false;
        } else {
            return false;
        }
    };

    setFirebaseDoc = async (docRef: DocumentReference, data: any) => {
        try {
            await setDoc(docRef, data);
        } catch (e) {
            console.error('Error updating document: ', e);
        }
    };

    deleteFirebaseDoc = async (docRef: DocumentReference) => {
        try {
            await deleteDoc(docRef);
        } catch (e) {
            console.error('Error deleting document: ', e);
        }
    };

    createFirebaseRef = (
        collection: string,
        document: string,
        subCollection?: string,
        subDocument?: string
    ) => {
        if (subCollection && subDocument) {
            return doc(
                this.db,
                collection,
                document,
                subCollection,
                subDocument
            );
        } else {
            return doc(this.db, collection, document);
        }
    };
}
