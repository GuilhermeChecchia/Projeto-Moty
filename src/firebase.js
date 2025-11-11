// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🎯 NOVO: Inicializa o Firestore

const firebaseConfig = {
    apiKey: "AIzaSyDYY046h5x-H-W6rTTRVwlpmNgK7_3R-i0",
    authDomain: "diario-ansiedade.firebaseapp.com",
    projectId: "diario-ansiedade",
    storageBucket: "diario-ansiedade.firebasestorage.app",
    messagingSenderId: "1050064763643",
    appId: "1:1050064763643:web:c9da94ffe6b8689438ce5e",
    measurementId: "G-6861R3PJF9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // 🎯 Objeto do Firestore

export { auth, db }; // 🎯 Exporta a Autenticação E o Banco de Dados