import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
// import "firebaseui/dist/firebaseui.css";
import "../custom-firebaseui.css";

import Header from '../components/Header';

import Footer from '../components/Footer';



import { app } from "../firebase";

import logo from '../assets/edusync-logo.png';

export default function LoginPage() {
    useEffect(() => {
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth(app));
        
        ui.start('#firebase-slay-button', {
            // popup instead of redirect
            signInFlow: 'popup', 
            signInSuccessUrl: '/homepage',
            signInOptions: [
                {
                    //google login
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                },
                {
                    //email login
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                }
            ],
            //google one tap sign in
            credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
        });
    }, []);

    return (
        <>
        <Header buttonText="HOME" buttonLink="/"/>

        <div className="flex justify-center items-center min-h-screen relative">

            {/* Login box */}
            <div className="relative w-[380px] h-[450px] bg-gray-200 rounded-[79px] border bg-gray-200 border-neutral-700 z-10 mt-[-150px]">
                <div className="absolute top-0 left-0 right-0 flex justify-center items-start pt-5 text-neutral-700 text-7xl font-bold font-['Quicksand']">
                    Login
                </div>
                <div id="firebase-slay-button" className="absolute left-0 right-0 mt-[150px]"/>
            </div>

            {/* The blue and yellow blurs */}
            <div className="absolute top-[100px] right-[450px] w-[500px] h-[375px] bg-[#F7E2B3] opacity-84 shadow-[10px_10px_20px_#000000] blur-[113.60px]"></div>
            <div className="absolute bottom-[200px] left-[450px] w-[300px] h-[350px] bg-[#6EB0B6] opacity-58 shadow-[10px_10px_20px_#000000] blur-[84.50px]"></div>
        </div>

    </>

    );
}
