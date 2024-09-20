import React, { useState, useEffect } from 'react';
import { auth } from './config/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import Login from './components/Login';
import Home from './components/Home';
import { Box, Text, Button } from '@chakra-ui/react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleResendVerification = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      alert("Verification email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Error sending verification email. Please try again.");
    }
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (user && !user.emailVerified) {
    return (
      <Box textAlign="center" mt={10}>
        <Text>Please verify your email address. Check your inbox for a verification link.</Text>
        <Button onClick={handleResendVerification} mt={4}>Resend Verification Email</Button>
      </Box>
    );
  }

  return (
    <div>
      {user && user.emailVerified ? <Home user={user} /> : <Login />}
    </div>
  );
}

export default App;
