import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from '../config/firebaseConfig';
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Box, Heading } from '@chakra-ui/react';

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
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
      p={4}
    >
      <Heading as="h1" mb={6} color="teal.600">
        Servibar
      </Heading>
      <Button onClick={handleSignIn} colorScheme="blue">
        Sign In with Google
      </Button>
    </Box>
  );
};

export default Login;
