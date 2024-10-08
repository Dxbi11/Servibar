import React, { useRef, useState, useEffect, useContext } from "react";
import { store } from "../../store";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { Button } from "@chakra-ui/react";
import HotelRoomsTable from "./Rack/HotelRoomsTable";
import RackMenu from "./Rack/RackMenu";
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

import useFetchHotels from "../hooks/HotelHooks/useFetchHotels";
import useFetchStoreHouse from "../hooks/StoreHooks/useFetchStoreHouse";
import useFetchRoomStock from "../hooks/RoomStockHooks/useFetchRoomStock";
import useFetchRooms from "../hooks/RoomHooks/useFetchRooms";
import useFetchFloors from "../hooks/RackHooks/useFetchFloors";

const Home = ({ user }) => {
  const { state, dispatch } = useContext(store);
  const HotelId = state.ui.hotelId;
  const hotels = state.ui.hotels;
  const floors = state.ui.floors;
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [selectedFloorId, setSelectedFloorId] = useState("1");

  useFetchHotels();
  useFetchStoreHouse()
  useFetchRoomStock();
  useFetchFloors(selectedHotelId);
  useFetchRooms(selectedFloorId);

  const handleHotelId = (selectedHotelId) => {
    dispatch({ type: "SET_HOTEL_ID", payload: selectedHotelId });
  };

  useEffect(() => {
    if (!HotelId) {
      dispatch({ type: "SET_HOTEL_ID", payload: selectedHotelId });
    }
  }, [selectedHotelId]);

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
    handleHotelId(selectedHotelId);
  };

  const handleFloorChange = (e) => {
    const selectedFloorId = e.target.value;
    console.log(selectedFloorId);
    setSelectedFloorId(selectedFloorId);
  };

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
      Select Hotel 🏨
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
      Select Floor 🏢
      <Select
        placeholder="Select Floor"
        value={selectedFloorId}
        onChange={handleFloorChange}
        mb={4}
        className="bg-white shadow"
      >
        {floors.map((floor) => (
          <option key={floor.id} value={floor.id}>
            {floor.floorNumber}
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
            <HotelRoomsTable />
          </TabPanel>
          <TabPanel>
            <MainInvoiceMenu />
          </TabPanel>
          <TabPanel>
            <MainInventory />
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
