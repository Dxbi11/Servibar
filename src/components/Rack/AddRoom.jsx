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
  Box,
} from '@chakra-ui/react';
import { createRoom } from '../../api';
import useCreateRoomStock from '../../hooks/RoomStockHooks/useCreateRoomStock';
import useFetchFloors from '../../hooks/RackHooks/useFetchFloors';

const AddRoom = ({ onRoomAdded }) => {
  const { createData } = useCreateRoomStock();
  const { state, dispatch } = useContext(store);
  const hotels = state.ui.hotels;
  const floors = state.ui.floors;
  const products = state.ui.products;
  const rooms = state.ui.rooms;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startRoomNumber, setStartRoomNumber] = useState('');
  const [endRoomNumber, setEndRoomNumber] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const comment = "";
  const checked = false;

  useFetchFloors(selectedHotel);

  const resetForm = () => {
    setStartRoomNumber('');
    setEndRoomNumber('');
    setSelectedHotel('');
    setSelectedFloor('');
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

    if (!selectedHotel || !selectedFloor || !startRoomNumber || !endRoomNumber) {
      setError('Please fill in all fields.');
      setIsSubmitting(false);
      return;
    }

    const start = parseInt(startRoomNumber);
    const end = parseInt(endRoomNumber);

    if (isNaN(start) || isNaN(end)) {
      setError('Room numbers must be valid numeric values.');
      setIsSubmitting(false);
      return;
    }

    if (end - start + 1 > 20) {
      setError('You cannot add more than 20 rooms at once.');
      setIsSubmitting(false);
      return;
    }

    if (start > end) {
      setError('Start room number cannot be greater than end room number.');
      setIsSubmitting(false);
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
        };
        const newRoom = await createRoom(RoomData);
        newRooms.push(newRoom);

        if (products.length > 0) {
          products.forEach(product => {
            const roomStock = {
              roomId: newRoom.id,
              productId: product.id,
              quantity: 0,
            };
            createData(roomStock.roomId, roomStock.productId, roomStock.quantity);
          });
        }
      }

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

      handleClose();
    } catch (error) {
      console.error('Error creating rooms:', error);
      setError(`Error creating rooms: ${error.message || 'Please try again.'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Add Rooms
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Rooms</ModalHeader>
          <Text as="b" color="red.500" fontSize="md" textAlign="center">
            * You cannot add more than 20 rooms to any floor.
          </Text>
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
                  <FormLabel>Floor</FormLabel>
                  <Select
                    placeholder="Select floor"
                    value={selectedFloor}
                    onChange={(e) => setSelectedFloor(e.target.value)}
                    isDisabled={isSubmitting}
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
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>End Room Number</FormLabel>
                  <Input
                    type="number"
                    value={endRoomNumber}
                    onChange={(e) => setEndRoomNumber(e.target.value)}
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
                Add Rooms
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

export default AddRoom;
