import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from '../config/firebaseConfig';


const Login = () => {
  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log("User signed in: ", user);
        console.log("Access token: ", token);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData ? error.customData.email : "N/A";
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error("Error code: ", errorCode);
        console.error("Error message: ", errorMessage);
        console.error("Email: ", email);
        console.error("Credential: ", credential);
      });
  };

  return (
    <div>
      <h1>Servibar</h1>
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};

export default Login;
