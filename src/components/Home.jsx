import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebaseConfig';


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
      <h4>Welcome, {user.displayName}</h4>
      <p>Email: {user.email}</p>
      <button onClick={handleSignOut}>iiiii</button>
    </div>
  );
};

export default Home;
