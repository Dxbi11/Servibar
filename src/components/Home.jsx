import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebaseConfig';
import { Navbar, Alignment, Button } from '@blueprintjs/core';

const Home = ({ user }) => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <div>
      <h4 className='bp5-heading {{.modifier}}'>Welcome, {user.displayName}</h4>
      <p>Email: {user.email}</p>
      <Button onClick={handleSignOut} text="sign out"/>
    </div>
  );
};

export default Home;
