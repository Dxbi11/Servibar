import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebaseConfig';
import { Button, ButtonGroup } from '@chakra-ui/react'
import AddHotelForm from './AddHotel';

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'

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
      <h4>Logged in as {user.displayName}</h4>
      <Menu>
        <MenuButton as={Button}>
          Actions
        </MenuButton>
        <MenuList>
          <MenuItem>Add Hotel</MenuItem>
          <MenuItem>Add Floor</MenuItem>
          <MenuItem>Add Room</MenuItem>
          <MenuItem>Delete</MenuItem>

        </MenuList>
      </Menu>
      <Button colorScheme='red' onClick={handleSignOut}>sign out</Button>
      <AddHotelForm/>
    </div>
  );
};

export default Home;
