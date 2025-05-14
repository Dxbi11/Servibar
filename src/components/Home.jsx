import React, { useState, useEffect, useContext } from "react";
import { store } from "../../store";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import {
  Button,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Box,
  Flex,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import HotelRoomsTable from "./Rack/HotelRoomsTable";
import RackMenu from "./Rack/RackMenu";
import MainInvoiceMenu from "./invoice/MainInvoiceMenu";
import StoreHouse from "./StoreHouse/StoreHouse";
import MainInventory from "./Inventory/MainInventory";

import useFetchHotels from "../hooks/HotelHooks/useFetchHotels";
import useFetchStoreHouse from "../hooks/StoreHooks/useFetchStoreHouse";
import useFetchRoomStock from "../hooks/RoomStockHooks/useFetchRoomStock";
import useFetchRooms from "../hooks/RoomHooks/useFetchRooms";
import useFetchFloors from "../hooks/RackHooks/useFetchFloors";

const Home = ({ user }) => {
  const { state, dispatch } = useContext(store);
  const hotels = state.ui.hotels;
  const floors = state.ui.floors;
  const hotelID = state.ui.hotelId;
  const floorID = state.ui.floorId;
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [selectedFloorId, setSelectedFloorId] = useState("");
  const [FloorData, setFloorData] = useState({});
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [hotelToValidate, setHotelToValidate] = useState(null);
  useFetchHotels();
  useFetchStoreHouse();
  useFetchRoomStock();
  useFetchFloors(selectedHotelId);
  useFetchRooms(selectedFloorId);


  const handleHotelId = (selectedHotelId) => {
    dispatch({ type: "SET_HOTEL_ID", payload: selectedHotelId });
  };
  const handleFloorId = (selectedFloorId) => {
    dispatch({ type: "SET_FLOOR_ID", payload: selectedFloorId });
  };
  const handleHotelChange = (e) => {
    
    const hotelId = e.target.value;
  
    const selectedHotel = hotels.find((hotel) => hotel.id === parseInt(hotelId));
  


  
    if (selectedHotel) {
      setHotelToValidate(selectedHotel); // Set the hotel for validation
      setIsPinModalOpen(true);  
             // Open the modal
    } else {
      console.error("Selected hotel not found!", hotels); // Log the `hotels` array for debugging
    }
  };

  const handlePinSubmit = () => {
    if (!hotelToValidate) {
      console.error("No hotel selected for PIN validation.");
      return;
    }
  
    if (!hotelToValidate.pin) {
      console.error("Selected hotel does not have a PIN defined.");
      return;
    }
  
    if (parseInt(pin) === hotelToValidate.pin) {
      setSelectedHotelId(hotelToValidate.id);
      handleHotelId(hotelToValidate.id);
      setIsPinModalOpen(false);
      setPin("");
    } else {
      alert("Incorrect PIN. Please try again.");
    }
  };
  

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const handleFloorChange = (e) => {
    const selectedFloorId = e.target.value;
    setSelectedFloorId(selectedFloorId);
    handleFloorId(selectedFloorId);
    const FloorData = floors.find((floor) => floor.id === parseInt(selectedFloorId));
    setFloorData(FloorData)
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
      </Flex>      Select Hotel 🏨
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
      {parseInt(hotelID) >= 0 ?        <div>Select Floor 🏢
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
          {parseFloat(floorID) >= 0 ? 
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
              <HotelRoomsTable FloorData={FloorData}/>
            </TabPanel>
            <TabPanel>
              <MainInvoiceMenu />
            </TabPanel>
            <TabPanel>
              <MainInventory />
            </TabPanel>
            <TabPanel>
              <RackMenu/>
            </TabPanel>
            <TabPanel>
              <StoreHouse />
            </TabPanel>
          </TabPanels>
        </Tabs>
        : 
      (      <>
      <Text fontWeight="bold" color='red' textAlign="center" fontSize="xl" mt={16}>⚠️ Please select a floor.</Text>
              <Tabs variant="enclosed" colorScheme="teal">
          <TabList>
            <Tab>Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <RackMenu/>
            </TabPanel>
          </TabPanels>
        </Tabs>
  </>)}
  </div>
      : 
      (      <>
      <Text fontWeight="bold" color='red' textAlign="center" fontSize="xl" mt={16}>⚠️ Please select a hotel.</Text>
              <Tabs variant="enclosed" colorScheme="teal">
          <TabList>
            <Tab>Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <RackMenu/>
            </TabPanel>
          </TabPanels>
        </Tabs>
  </>)}
      {/* PIN Validation Modal */}
      <Modal isOpen={isPinModalOpen} onClose={() => setIsPinModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter PIN for {hotelToValidate?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handlePinSubmit} mr={3}>
              Submit
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsPinModalOpen(false);
                setPin("");
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;
