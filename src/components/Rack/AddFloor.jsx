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
  Text,
  useToast,
} from '@chakra-ui/react';
import { createFloor, getAllHotels, getAllFloors } from '../../api';
const AddFloors = ({ onFloorAdded }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [floorNumber, setFloorNumber] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [hotels, setHotels] = useState([]);
  const [floors, setFloors] = useState([]);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedHotels, fetchedFloors] = await Promise.all([
          getAllHotels(),
          getAllFloors()
        ]);
        setHotels(fetchedHotels);
        setFloors(fetchedFloors);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedHotel) {
      setError('Please select a hotel.');
      return;
    }

    const floorExists = floors.some(
      floor => floor.hotelId === parseInt(selectedHotel) && floor.floorNumber === parseInt(floorNumber)
    );

    if (floorExists) {
      setError(`Floor ${floorNumber} already exists in the selected hotel.`);
      return;
    }

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
    } catch (error) {
      console.error('Error creating floor:', error);
      setError('Failed to create floor. Please try again.');
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
                {error && <Text color="red.500">{error}</Text>}
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