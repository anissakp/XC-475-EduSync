import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { app } from "../firebase";

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
        <>
            <h1>Login</h1>
            <div id="firebaseui-auth-container"></div>
        </>
    );
}
