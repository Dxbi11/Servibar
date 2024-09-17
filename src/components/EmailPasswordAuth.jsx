import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebaseConfig';
import { Button, Input, VStack, Text, useToast } from '@chakra-ui/react';

const EmailPasswordAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const toast = useToast();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Account created.",
          description: "You've successfully signed up.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Signed in.",
          description: "You've successfully signed in.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleAuth}>
      <VStack spacing={4}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" colorScheme="blue">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
        <Text
          as="button"
          onClick={() => setIsSignUp(!isSignUp)}
          color="blue.500"
        >
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </Text>
      </VStack>
    </form>
  );
};

export default EmailPasswordAuth;
