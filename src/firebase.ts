import { initializeApp } from "firebase/app";

// initialze firebase

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_CONFIG_APIKEY,
    authDomain: "edusync-e6e17.firebaseapp.com",
    projectId: "edusync-e6e17",
    storageBucket: "edusync-e6e17.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_CONFIG_SENDERID,
    appId: import.meta.env.VITE_FIREBASE_CONFIG_APPID,
    measurementId: import.meta.env.VITE_FIREBASE_CONFIG_MEASUREID
};

export const app = initializeApp(firebaseConfig);