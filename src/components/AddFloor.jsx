import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { createFloor, getAllHotels } from '../api'; // Import getAllHotels

const AddFloors = ({ onFloorAdded }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [floorNumber, setFloorNumber] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [hotels, setHotels] = useState([]); // State to store fetched hotels

  useEffect(() => {
    // Fetch hotels when the component mounts
    const fetchHotels = async () => {
      try {
        const fetchedHotels = await getAllHotels();
        setHotels(fetchedHotels);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        // You might want to show an error message to the user here
      }
    };

    fetchHotels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFloor = await createFloor({
        floorNumber: parseInt(floorNumber),
        hotelId: parseInt(selectedHotel),
      });
      onFloorAdded(newFloor);
      onClose();
      setFloorNumber('');
      setSelectedHotel('');
    } catch (error) {
      console.error('Error creating floor:', error);
      // You might want to show an error message to the user here
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
                    onChange={(e) => setSelectedHotel(e.target.value)}
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
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
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