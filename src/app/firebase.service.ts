import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

    constructor() {}
}
