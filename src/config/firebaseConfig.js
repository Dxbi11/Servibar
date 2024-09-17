import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAx21PNvv7Ztq4Y8erYISFiLHySZd-6Ecw",
    authDomain: "servibar1.firebaseapp.com",
    projectId: "servibar1",
    storageBucket: "servibar1.appspot.com",
    messagingSenderId: "377899212959",
    appId: "1:377899212959:web:9b75f11f85b636181d42aa",
    measurementId: "G-P9BT86X9M1"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the initialized Firebase components
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();