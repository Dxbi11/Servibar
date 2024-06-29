import React, { useRef, useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { Button } from "@chakra-ui/react";
import HotelRoomsTable from "./Rack/HotelRoomsTable";
import RackMenu from "./Rack/RackMenu";
import { getAllHotels } from "./api";
import {
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  }, []);

  const handleHotelChange = (e) => {
    const selectedHotelId = e.target.value;
    setSelectedHotelId(selectedHotelId);
  };

  return (
    <div>
      <h4>Logged in as {user.displayName}</h4>
      <Select
        placeholder="Select Hotel"
        value={selectedHotelId}
        onChange={handleHotelChange}
        mb={4}
      >
        {hotels.map((hotel) => (
          <option key={hotel.id} value={hotel.id}>
            {hotel.name}
          </option>
        ))}
      </Select>
      <Tabs>
        <TabList>
          <Tab>Rack</Tab>
          <Tab>invoice</Tab>
          <Tab>inventory</Tab>

          <Tab>Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <HotelRoomsTable hotelId={selectedHotelId} />
          </TabPanel>
          <TabPanel>
            <h1>invoice component goes here</h1>
          </TabPanel>
          <TabPanel>
            <MainInventory hotelId={selectedHotelId} />
          </TabPanel>
          <TabPanel>
            <RackMenu />
            <Button colorScheme="red" onClick={handleSignOut}>
              Sign out
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Home;
