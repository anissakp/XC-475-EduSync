import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { app } from "../firebase";
import { Link } from 'react-router-dom';

//*************************** CHECK VIDEO FOR IF CLIENT ID */

export default function LoginPage() { 
    useEffect( () => {
        const ui = 
            firebaseui.auth.AuthUI.getInstance() ||
            new firebaseui.auth.AuthUI(getAuth(app));
        
        ui.start("#firebaseui-auth-container", {
            signInSuccessUrl: "/",
            signInOptions: [
                //google login
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    clientId: "1018973533872-qnj9q2sdku9o1fq10rhq55qae790eloq.apps.googleusercontent.com",
                },
                //email login 
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                },
            ],
            // for google one tap sign in
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