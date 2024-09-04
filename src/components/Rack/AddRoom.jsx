import React, { useState, useEffect, useContext } from 'react';
import { store } from '../../../store';
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
  VStack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { createRoom, getAllHotels, getHotelById, getAllFloors, getFloorById } from '../../api';

const AddRoom = ({ onRoomAdded }) => {
  const { state, dispatch } = useContext(store);
  const hotels = state.ui.hotels;
  const floors = state.ui.floors;
  const rooms = state.ui.rooms;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startRoomNumber, setStartRoomNumber] = useState('');
  const [endRoomNumber, setEndRoomNumber] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();
  const comment = "";
  const checked = false;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedHotel || !selectedFloor || !startRoomNumber || !endRoomNumber) {
      setError('Please fill in all fields.');
      return;
    }

    const start = parseInt(startRoomNumber);
    const end = parseInt(endRoomNumber);

    if (start > end) {
      setError('Start room number cannot be greater than end room number.');
      return;
    }

    try {
      const newRooms = [];
      for (let roomNumber = start; roomNumber <= end; roomNumber++) {
        const RoomData = {
          roomNumber,
          hotelId: parseInt(selectedHotel),
          floorId: parseInt(selectedFloor),
          locked: false,
          state: 0,
          comment: comment,
          checked: checked,
        }
        const newRoom = await createRoom(RoomData);
        console.log(RoomData);
        console.log(newRoom);
        newRooms.push(newRoom);
      }

      // Dispatch an action to add the new rooms to the context
      dispatch({
        type: 'SET_ROOMS',
        payload: [...state.ui.rooms, ...newRooms],
      });

      toast({
        title: 'Rooms added.',
        description: `Rooms ${startRoomNumber} to ${endRoomNumber} have been added to the floor.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      setStartRoomNumber('');
      setEndRoomNumber('');
      setSelectedHotel('');
      setSelectedFloor('');
    } catch (error) {
      console.error('Error creating rooms:', error);
      setError('Failed to create rooms. Please try again.');
    }
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Add Rooms
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Rooms</ModalHeader>
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
                  <FormLabel>Floor</FormLabel>
                  <Select
                    placeholder="Select floor"
                    value={selectedFloor}
                    onChange={(e) => setSelectedFloor(e.target.value)}
                  >
                    {floors.map((floor) => (
                      <option key={floor.id} value={floor.id}>
                        {floor.floorNumber}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Start Room Number</FormLabel>
                  <Input
                    type="number"
                    value={startRoomNumber}
                    onChange={(e) => setStartRoomNumber(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>End Room Number</FormLabel>
                  <Input
                    type="number"
                    value={endRoomNumber}
                    onChange={(e) => setEndRoomNumber(e.target.value)}
                  />
                </FormControl>
                {error && <Text color="red.500">{error}</Text>}
              </VStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Add Rooms
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

export default AddRoom;
