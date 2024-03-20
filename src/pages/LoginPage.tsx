import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { app } from "../firebase";

import logo from '../assets/edusync-logo.png';


export default function LoginPage() {
    useEffect(() => {
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(getAuth(app));
        
        ui.start('#firebaseui-auth-container', {
            // popup instead of redirect
            signInFlow: 'popup', 
            signInSuccessUrl: '/',
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
        <div className="flex justify-center items-center min-h-screen relative bg-gray-200">

            <header className="fixed top-0 w-full h-[60px] bg-gray-200 z-20">

            <div className="flex justify-between items-center w-full mr-8">
                <img src={logo} alt="Logo" className="h-[40px] mt-3 pl-6" />
                <div className="flex justify-end space-x-6 pr-6">
                    <div className="text-black text-base font-normal font-['Quicksand'] mt-5">Meet the team</div>
                    <div className="text-black text-base font-normal font-['Quicksand'] mt-5">About us</div>
                    <div className="w-[89px] h-[42px] flex-col justify-start items-start inline-fle mt-3">
                        <div className="px-[22px] py-2 bg-neutral-800 rounded-[32px] shadow flex-col justify-center items-center flex">
                            <div className="justify-center items-center gap-2 inline-flex">
                                <div className="text-gray-300 text-[15px] font-medium font-['Quicksand'] uppercase leading-relaxed tracking-wide">Home</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </header>

            <div className="relative w-[380px] h-[450px] bg-gray-200 rounded-[79px] border bg-gray-200 border-neutral-700 z-10">
                <div className="absolute top-0 left-0 right-0 flex justify-center items-start pt-5 text-neutral-700 text-7xl font-bold font-['Quicksand']">
                    Login
                </div>
                <div id="firebaseui-auth-container" className="absolute left-0 right-0 mt-[150px]"/>
            </div>

            <div className="absolute top-[100px] right-[450px] w-[500px] h-[375px] bg-[#F7E2B3] opacity-84 shadow-[10px_10px_30px_#000000] blur-[113.60px]"></div>
            <div className="absolute bottom-[100px] left-[450px] w-[300px] h-[350px] bg-[#6EB0B6] opacity-58 shadow-[10px_10px_30px_#000000] blur-[84.50px]"></div>

            <footer className="fixed bottom-0 w-[1440px] h-[60px] bg-gradient-to-t from-[#6EB0B6] to-[#A2D9D1]">
                <div className="text-center text-neutral-700 text-sm font-normal font-['Quicksand'] mt-5">©2024 All rights reserved to EduSync Team</div>
            </footer>
        </div>
      );
}
