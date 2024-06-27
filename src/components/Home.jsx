import React, { useRef } from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../config/firebaseConfig';
import { Button, ButtonGroup } from '@chakra-ui/react';
import HotelRoomsTable from './HotelRoomsTable';
import RackMenu from './RackMenu';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'




const Home = ({ user }) => {
  const hotelRoomsTableRef = useRef(null);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const handleRefresh = () => {
    if (hotelRoomsTableRef.current) {
      hotelRoomsTableRef.current.refresh();
    }
  };

  return (
    <div>
      <h4>Logged in as {user.displayName}</h4>
      <Button colorScheme='blue' onClick={handleRefresh}>Refresh</Button>
      <Tabs>


        <TabList>
          <Tab>Rack</Tab>
          <Tab>invoice</Tab>
          <Tab>inventory</Tab>
          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            
            <HotelRoomsTable ref={hotelRoomsTableRef} />
            
          </TabPanel>
          <TabPanel>
            <h1>invoice component goes here</h1>
          </TabPanel>
          <TabPanel>
            <p>Inventory component goes here</p>
          </TabPanel>
          <TabPanel>
            <RackMenu/>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Button colorScheme='red' onClick={handleSignOut}>Sign out</Button>
    </div>
  );
};

export default Home;
