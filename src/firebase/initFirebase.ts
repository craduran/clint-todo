import { getApps, initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from 'firebase/performance';
import { Firestore } from 'firebase/firestore';

const clientCredentials = {
    apiKey: "AIzaSyC7xdlBJDiVnya3QZbQl8j-WNINohD3Smo",
    authDomain: "todos-d44b1.firebaseapp.com",
    projectId: "todos-d44b1",
    storageBucket: "todos-d44b1.appspot.com",
    messagingSenderId: "223128346936",
    appId: "1:223128346936:web:b922b64977edf2464d21cd",
    measurementId: "G-PF61LGBPC2"
}

export default function initFirebase() {
    if(!getApps().length) {
        initializeApp(clientCredentials);

        if(typeof window !== "undefined") {
            if('measurementId' in clientCredentials) {
                getAnalytics();
                getPerformance();
            }
        }
        console.log("Firebase succesfully initialized!!!");
    }
}