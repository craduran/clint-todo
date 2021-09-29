import { getApps, initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from 'firebase/performance';
import { Firestore } from 'firebase/firestore';

const clientCredentials = {
    apiKey: <API_KEY>,
    authDomain: <authDomain>,
    projectId: <ProjectID>,
    storageBucket: <StorageBucket>,
    messagingSenderId: <MessagingSenderId>,
    appId: <AppID>,
    measurementId: <MeasurementId>
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