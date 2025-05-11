import React, { useState, useContext } from 'react';
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
  Select,
  useDisclosure,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';

import { 
  getAllHotels, 
  getAllFloors, 
  getAllRooms, 
  deleteHotel, 
  deleteFloor, 
  deleteRoom 
} from '../../api';

import useFetchHotels from '../../hooks/HotelHooks/useFetchHotels';

const DeleteModal = ({ onDelete }) => { 
  const {state, dispatch} = useContext(store);
  const hotels = state.ui.hotels;
  const floors = state.ui.floors;
  const rooms = state.ui.rooms;
  const selectedFloorId = state.ui.floorId;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteType, setDeleteType] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  useFetchHotels();

  const handleDelete = async () => {
    setError('');

    if (!deleteType || !selectedItem) {
      setError('Please select both a delete type and an item to delete.');
      return;
    }
    
    try {
      const selectedItemId = parseInt(selectedItem);
      
      switch (deleteType) {
        case 'hotel':
          // First identify all floors in this hotel
          const hotelFloors = floors.filter(floor => floor.hotelId === selectedItemId);
          
          // For each floor, identify and delete all rooms
          for (const floor of hotelFloors) {
            const floorRooms = rooms.filter(room => room.floorId === floor.id);
            for (const room of floorRooms) {
              await deleteRoom(room.id);
              // Update local state for immediate UI feedback
              dispatch({ type: "SET_ROOMS", payload: rooms.filter(r => r.id !== room.id) });
            }
            
            // Then delete the floor
            await deleteFloor(floor.id);
            // Update local state for immediate UI feedback
            dispatch({ type: "SET_FLOORS", payload: floors.filter(f => f.id !== floor.id) });
          }
          
          // Finally delete the hotel
          await deleteHotel(selectedItemId);
          // Update local state for immediate UI feedback
          dispatch({ type: "SET_HOTELS", payload: hotels.filter(h => h.id !== selectedItemId) });
          break;
          
        case 'floor':
          // Get all rooms for the selected floor
          const roomsToDelete = rooms.filter(room => room.floorId === selectedItemId);
          
          // Delete all rooms on the selected floor
          for (const room of roomsToDelete) {
            await deleteRoom(room.id);
            // Update local state for immediate UI feedback
            dispatch({ type: "SET_ROOMS", payload: rooms.filter(r => r.id !== room.id) });
          }
          
          // Now delete the floor
          await deleteFloor(selectedItemId);
          // Update local state for immediate UI feedback
          dispatch({ type: "SET_FLOORS", payload: floors.filter(f => f.id !== selectedItemId) });
          break;
          
        case 'room':
          await deleteRoom(selectedItemId);
          // Update local state for immediate UI feedback
          dispatch({ type: "SET_ROOMS", payload: rooms.filter(r => r.id !== selectedItemId) });
          break;
          
        default:
          throw new Error('Invalid delete type');
      }

      // Call onDelete if it's provided
      if (typeof onDelete === 'function') {
        onDelete(deleteType, selectedItem);
      }

      toast({
        title: "Item deleted.",
        description: `The selected ${deleteType} has been deleted successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Close modal and reset form
      onClose();
      setDeleteType('');
      setSelectedItem('');
      

    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      setError(`Failed to delete ${deleteType}: ${error.message}. Please try again.`);
      toast({
        title: "Delete failed",
        description: `Failed to delete the selected ${deleteType}.`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const renderItemOptions = () => {
    switch (deleteType) {
      case 'hotel':
        return hotels.map(hotel => (
          <option key={hotel.id} value={hotel.id}>
            {hotel.name} 
          </option>
        ));
      case 'floor':
        return floors.map(floor => {
          const floorRoomsCount = rooms.filter(r => r.floorId === floor.id).length;
          const hotelName = hotels.find(h => h.id === floor.hotelId)?.name || 'Unknown Hotel';
          return (
            <option key={floor.id} value={floor.id}>
              Floor {floor.floorNumber} - {hotelName} ({floor.id === parseInt(selectedFloorId) ? `${floorRoomsCount} rooms` : "Change floor to see number of rooms"})
            </option>
          );
        });
      case 'room':
        return rooms.map(room => {
          const floor = floors.find(f => f.id === room.floorId);
          const floorNumber = floor ? floor.floorNumber : 'Unknown Floor';
          const hotel = floor ? hotels.find(h => h.id === floor.hotelId) : null;
          const hotelName = hotel ? hotel.name : 'Unknown Hotel';
          
          return (
            <option key={room.id} value={room.id}>
              Room {room.roomNumber} - Floor {floorNumber} - {hotelName}
            </option>
          );
        });
      default:
        return null;
    }
  };

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Delete Item
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Select what to delete</FormLabel>
                <Select
                  placeholder="Select delete type"
                  value={deleteType}
                  onChange={(e) => {
                    setDeleteType(e.target.value);
                    setSelectedItem('');
                  }}
                >
                  <option value="hotel">Hotel</option>
                  <option value="floor">Floor</option>
                  <option value="room">Room</option>
                </Select>
              </FormControl>
              {deleteType && (
                <FormControl isRequired>
                  <FormLabel>Select item to delete</FormLabel>
                  <Select
                    placeholder={`Select ${deleteType} to delete`}
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                  >
                    {renderItemOptions()}
                  </Select>
                </FormControl>
              )}
              {error && <Text color="red.500">{error}</Text>}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>
              Delete
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

export default DeleteModal;