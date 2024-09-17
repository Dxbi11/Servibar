import React, { useState, useEffect } from 'react';
import { auth } from './config/firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? <Home user={user} /> : <Login />}
    </div>
  );
}

export default App;
