import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from '../config/firebaseConfig';
import { Button } from "@blueprintjs/core";

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
      <h1 class="bp5-heading {{.modifier}}">Servibar</h1>
      <Button
  type="button"
  onClick={handleSignIn}
  intent="primary"
  text="Sign in with Google"
/>
    </div>
  );
};

export default Login;
