import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// I added this new file for setting up firebase, we were supposed to
// have an initializeApp but I couldn't find it anywhere

const firebaseConfig = {
    apiKey: "AIzaSyBjmO7ZGE9Oj0KODc_xWYc8z0WBMCpBds8",
    authDomain: "edusync-e6e17.firebaseapp.com",
    projectId: "edusync-e6e17",
    storageBucket: "edusync-e6e17.appspot.com",
    messagingSenderId: "1018973533872",
    appId: "1: 1018973533872 :web: 9d3056718476baab0fed75",
    measurementId: "G-FWCZM8QVTL"
};


// const auth = getAuth(app);

export const app = initializeApp(firebaseConfig);