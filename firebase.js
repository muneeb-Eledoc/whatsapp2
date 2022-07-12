import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB_KLgBQPVOKTfB3pxQYXXFb7I2npn2k2Y",
    authDomain: "whatsapp2-0-eeb7e.firebaseapp.com",
    projectId: "whatsapp2-0-eeb7e",
    storageBucket: "whatsapp2-0-eeb7e.appspot.com",
    messagingSenderId: "505337147425",
    appId: "1:505337147425:web:3e09a3556b1d93e80e3360",
    measurementId: "G-C99FTX0FVZ"
};

const app = initializeApp(firebaseConfig)

const db = getFirestore(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider }