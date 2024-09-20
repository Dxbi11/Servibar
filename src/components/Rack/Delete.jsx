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
  const DeleteModal = ({ onDelete }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [deleteType, setDeleteType] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const [hotels, setHotels] = useState([]);
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
    const toast = useToast();
  
    console.log(selectedItem);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [fetchedHotels, fetchedFloors, fetchedRooms] = await Promise.all([
            getAllHotels(),
            getAllFloors(),
            getAllRooms()
          ]);
          setHotels(fetchedHotels);
          setFloors(fetchedFloors);
          setRooms(fetchedRooms);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to load data. Please try again later.');
        }
      };
  
      fetchData();
    }, [isOpen]);
  
    const handleDelete = async () => {
      setError('');
  
      if (!deleteType || !selectedItem) {
        setError('Please select both a delete type and an item to delete.');
        return;
      }
  
      try {
        switch (deleteType) {
          case 'hotel':
            await deleteHotel(selectedItem);
            break;
          case 'floor':
            // Get all rooms for the selected floor
            const roomsToDelete = rooms.filter(room => room.floorId === selectedItem);
            
            // Delete all rooms on the selected floor
            await Promise.all(roomsToDelete.map(room => deleteRoom(room.id)));
            
            // Now delete the floor
            await deleteFloor(selectedItem);
            break;
          case 'room':
            await deleteRoom(selectedItem);
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
          description: `The selected ${deleteType} has been deleted.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
  
        // Refresh the data after deletion
        const [updatedHotels, updatedFloors, updatedRooms] = await Promise.all([
          getAllHotels(),
          getAllFloors(),
          getAllRooms()
        ]);
        setHotels(updatedHotels);
        setFloors(updatedFloors);
        setRooms(updatedRooms);
  
        onClose();
        setDeleteType('');
        setSelectedItem('');
      } catch (error) {
        console.error(`Error deleting ${deleteType}:`, error);
        setError(`Failed to delete ${deleteType}. Please try again.`);
      }
    };
  
    const renderItemOptions = () => {
      switch (deleteType) {
        case 'hotel':
          return hotels.map(hotel => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ));
        case 'floor':
          return floors.map(floor => (
            <option key={floor.id} value={floor.id}>Floor {floor.floorNumber} (Hotel: {hotels.find(h => h.id === floor.hotelId)?.name})</option>
          ));
        case 'room':
          return rooms.map(room => (
            <option key={room.id} value={room.id}>
              Room {room.roomNumber} (Floor: {floors.find(f => f.id === room.floorId)?.floorNumber}, 
              Hotel: {hotels.find(h => h.id === floors.find(f => f.id === room.floorId)?.hotelId)?.name})
            </option>
          ));
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