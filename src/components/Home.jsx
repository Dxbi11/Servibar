import React, { useRef, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { Button } from "@chakra-ui/react";
import HotelRoomsTable from "./Rack/HotelRoomsTable";
import RackMenu from "./Rack/RackMenu";
import { getAllHotels } from "./api";
import MainInvoiceMenu from "./invoice/MainInvoiceMenu";
import StoreHouse from "./StoreHouse/StoreHouse";
import {
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Flex,
  Heading,
} from "@chakra-ui/react";
import MainInventory from "./Inventory/MainInventory";

const Home = ({ user }) => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState("1");

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const handleHotelChange = (e) => {
    const selectedHotelId = e.target.value;
    setSelectedHotelId(selectedHotelId);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getAllHotels();
        setHotels(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHotels();
  }, [handleHotelChange]);


  /*          
                    <TabPanel>
            <MainInvoiceMenu hotelId={selectedHotelId} />
          </TabPanel>
          
          */
  return (
    <Box p={4} className="min-h-screen bg-gray-100">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h4" size="md">
          Logged in as {user.displayName}
        </Heading>
        <Button colorScheme="red" onClick={handleSignOut}>
          Sign out
        </Button>
      </Flex>
      <Select
        placeholder="Select Hotel"
        value={selectedHotelId}
        onChange={handleHotelChange}
        mb={4}
        className="bg-white shadow"
      >
        {hotels.map((hotel) => (
          <option key={hotel.id} value={hotel.id}>
            {hotel.name}
          </option>
        ))}
      </Select>
      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>Rack</Tab>
          <Tab>Invoice</Tab>
          <Tab>Inventory</Tab>
          <Tab>Settings</Tab>
          <Tab>Store House</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <HotelRoomsTable hotelId={selectedHotelId} />
          </TabPanel>

          <TabPanel>
            <MainInventory hotelId={selectedHotelId} />
          </TabPanel>
          <TabPanel>
            <RackMenu />
          </TabPanel>
          <TabPanel>
            <StoreHouse />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Home;
