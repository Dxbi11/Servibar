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
  Box,
} from '@chakra-ui/react';
import { createFloor } from '../../api';

const AddFloors = ({ onFloorAdded }) => {
  const { state, dispatch } = useContext(store);
  const hotels = state.ui.hotels;
  const floors = state.ui.floors;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [floorNumber, setFloorNumber] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleFloors = (floors) => {
    dispatch({ type: 'SET_FLOORS', payload: floors });
  };

  const resetForm = () => {
    setFloorNumber('');
    setSelectedHotel('');
    setError('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!selectedHotel || !floorNumber) {
      setError('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }

    const floorNum = parseInt(floorNumber);
    if (isNaN(floorNum)) {
      setError('Floor number must be a valid numeric value.');
      setIsSubmitting(false);
      return;
    }

    try {
      const newFloor = await createFloor({
        floorNumber: floorNum,
        hotelId: parseInt(selectedHotel),
      });

      toast({
        title: "Floor added.",
        description: `Floor ${floorNumber} has been added to the hotel.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      handleFloors([...floors, newFloor]);
      handleClose();
    } catch (error) {
      console.error("Error adding floor:", error);
      setError(`Error adding floor: ${error.message || 'Please try again.'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Add New Floor
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
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
                    onChange={(e) => {
                      setSelectedHotel(e.target.value);
                      dispatch({ type: "SET_HOTEL_ID", payload: e.target.value });
                    }}
                    isDisabled={isSubmitting}
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
                    isDisabled={isSubmitting}
                  />
                </FormControl>
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter flexDirection="column" alignItems="stretch">
            <Box display="flex" justifyContent="space-between" width="100%">
              <Button 
                variant="ghost" 
                onClick={handleClose}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="Adding..."
                isDisabled={isSubmitting}
              >
                Add Floor
              </Button>
            </Box>
            
            {error && (
              <Box mt={4} width="100%">
                <Text color="red.500" textAlign="center">
                  {error}
                </Text>
              </Box>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddFloors;
