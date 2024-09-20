import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        toast({
          title: "Account created.",
          description: "We've sent you an email verification link. Please check your inbox.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          toast({
            title: "Email not verified",
            description: "Please verify your email before signing in. Check your inbox for the verification link.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
          return;
        }
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
