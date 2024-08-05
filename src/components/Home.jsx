import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { Button, useToast, Text } from "@chakra-ui/react";
import HotelRoomsTable from "./Rack/HotelRoomsTable";
import { getAllHotels } from "./api";
import MainInvoiceMenu from "./invoice/MainInvoiceMenu";

import MainInventory from "./Inventory/MainInventory";
import MainSettings from "./settings/MainSettings";

  
  
  
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  PinInput,
  PinInputField,
  HStack,
} from "@chakra-ui/react";

const Home = ({ user }) => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState("0");
  const [tempSelectedHotelId, setTempSelectedHotelId] = useState("0");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const toast = useToast();

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
    const newHotelId = e.target.value;
    setTempSelectedHotelId(newHotelId);
    setIsPinModalOpen(true);
  };

  const handlePinSubmit = () => {
    const selectedHotel = hotels.find(
      (hotel) => hotel.id === parseInt(tempSelectedHotelId)
    );

    if (selectedHotel && pin === selectedHotel.pin.toString()) {
      setSelectedHotelId(tempSelectedHotelId);
      toast({
        title: "Hotel changed.",
        description: `Hotel changed to ${selectedHotel.name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsPinModalOpen(false);
    } else {
      toast({
        title: "Invalid PIN.",
        description: "The PIN entered is incorrect.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setPin("");
  };

  const handlePinModalClose = () => {
    setPin("");
    setIsPinModalOpen(false);
    setTempSelectedHotelId(selectedHotelId);
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
            <MainInvoiceMenu hotelId={selectedHotelId} />
          </TabPanel>
          <TabPanel>
            <MainInventory hotelId={selectedHotelId} />
          </TabPanel>
          <TabPanel>
            <MainSettings />
          </TabPanel>
          <TabPanel>
            <StoreHouse />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isPinModalOpen} onClose={handlePinModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="3xl">Enter PIN</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack>
              <PinInput
                value={pin}
                onChange={(value) => setPin(value)}
                size="md"
                type="number"
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handlePinSubmit}>
              Submit
            </Button>
            <Button colorScheme="blue" ml={3} onClick={handlePinModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Home;
