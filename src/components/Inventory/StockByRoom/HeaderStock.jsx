import React, { useState, useEffect } from 'react';
import { createRoom, getAllHotels, getHotelById, getAllFloors, getFloorById } from '../../../api'; // Import API functions
import { Select, Input, HStack, Button, Box, Center } from '@chakra-ui/react'
import TableStock from './TableStock';

const HeaderStock = () => {
    const [hotels, setHotels] = useState([]);
    const [floors, setFloors] = useState([]);
    const [room, setRoom] = useState('');
    const [isvalid, setIsValid] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');

    useEffect(() => {
      async function fetchHotels() {
          try {
              const hotelsData = await getAllHotels();
              setHotels(hotelsData);
          } catch (error) {
              console.error('Error fetching hotels:', error);
          }
      }
      fetchHotels();
  }, []);

  useEffect(() => {
      async function fetchHotelAndFloors() {
          try {
              if (selectedHotel) {
                  const hotel = await getHotelById(selectedHotel);
                  setFloors(hotel.floors);
              } else {
                  setFloors([]); // Clear floors if selectedHotel is falsy
              }
          } catch (error) {
              console.error('Error fetching hotel and floors:', error);
          }
      }
      fetchHotelAndFloors();
  }, [selectedHotel]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        if (selectedFloor) {
          const floor = await getFloorById(selectedFloor);
          console.log(floor);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    }
    fetchRooms();
  } , [selectedFloor]);

  const handleTable = () => {
    if (selectedHotel && selectedFloor && room) {
      setIsValid(true);
    }
  }

    return (
      <div>
        <HStack spacing={4} align="center">
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
          {selectedHotel && (
          <>
            <Select
              placeholder="🏢 Select a Floor"
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              {floors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.floorNumber}
                </option>
              ))}
            </Select>
            
            {selectedFloor && (
              <Input type="number" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="🔢 Enter a Room Number" />
            )}
          </>
        )}
        </HStack>
        
        <Center mt={8}>
          <Button onClick={handleTable} colorScheme='green'>Add Room Stock Table</Button>
        </Center>
      <div>
      </div>
        {isvalid ? <TableStock /> : null}
      </div>
    )
}

export default HeaderStock;



