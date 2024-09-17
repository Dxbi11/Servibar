import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from '../config/firebaseConfig';
import { Button, VStack, Box, Heading } from '@chakra-ui/react';
import EmailPasswordAuth from './EmailPasswordAuth';

const Login = () => {
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
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
      <VStack spacing={4} width="300px">
        <EmailPasswordAuth />
        <Button onClick={handleGoogleSignIn} colorScheme="red" width="full">
          Sign In with Google
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
