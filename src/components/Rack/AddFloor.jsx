import React, { useState, useContext } from "react";
import { store } from "../../../store";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { createFloor } from '../../api';
const AddFloors = ({ onFloorAdded }) => {
  const {state, dispatch} = useContext(store);
  const hotels = state.ui.hotels;
  const floors = state.ui.floors;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [floorNumber, setFloorNumber] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  const handleFloors = (floors) => {  
    dispatch({ type: 'SET_FLOORS', payload: floors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFloor = await createFloor({
        floorNumber: parseInt(floorNumber),
        hotelId: parseInt(selectedHotel),
      });


      toast({
        title: "Floor added.",
        description: `Floor ${floorNumber} has been added to the hotel.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      setFloorNumber('');
      setSelectedHotel('');
      handleFloors([...floors, newFloor]);
    } catch (error) {
      console.error("Error adding floor:", error);
    }
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Add New Floor
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Floor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Hotel</FormLabel>
                  <Select
                    placeholder="Select hotel"
                    value={selectedHotel}
                    onChange={(e) => (setSelectedHotel(e.target.value), dispatch({ type: "SET_HOTEL_ID", payload: e.target.value }))}
                  >
                    {hotels.map((hotel) => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Floor Number</FormLabel>
                  <Input
                    type="number"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(e.target.value)}
                  />
                </FormControl>
                {error && <Text color="red.500">{error}</Text>}
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
            >
              Add Floor
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddFloors;
