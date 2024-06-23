import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { getAllHotels } from '../api'; // Assuming you have this function in your api.js

const getRoomStatus = (state) => {
  switch (state) {
    case 0:
      return { label: 'Available', color: 'green' };
    case 1:
      return { label: 'In House', color: 'blue' };
    case 2:
      return { label: 'Leaving', color: 'orange' };
    case 3:
      return { label: 'Already Left', color: 'red' };
    default:
      return { label: 'Unknown', color: 'gray' };
  }
};

const HotelRoomsTable = () => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotelsData = await getAllHotels();
        setHotels(hotelsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setError('Failed to load hotels. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  if (hotels.length === 0) {
    return (
      <Center h="100vh">
        <Text>No hotels found.</Text>
      </Center>
    );
  }

  return (
    <Box>
      <Accordion allowMultiple>
        {hotels.map((hotel) => (
          <AccordionItem key={hotel.id}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text fontWeight="bold">{hotel.name}</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Accordion allowMultiple>
                {hotel.floors && hotel.floors.length > 0 ? (
                  hotel.floors.map((floor) => (
                    <AccordionItem key={floor.id}>
                      <h3>
                        <AccordionButton>
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="semibold">Floor {floor.floorNumber}</Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h3>
                      <AccordionPanel pb={4}>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>Room Number</Th>
                              <Th>Status</Th>
                              <Th>Locked</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {floor.rooms && floor.rooms.length > 0 ? (
                              floor.rooms.map((room) => {
                                const status = getRoomStatus(room.state);
                                return (
                                  <Tr key={room.id}>
                                    <Td>{room.roomNumber}</Td>
                                    <Td>
                                      <Badge colorScheme={status.color}>{status.label}</Badge>
                                    </Td>
                                    <Td>
                                      <Badge colorScheme={room.locked ? 'red' : 'green'}>
                                        {room.locked ? 'Locked' : 'Unlocked'}
                                      </Badge>
                                    </Td>
                                  </Tr>
                                );
                              })
                            ) : (
                              <Tr>
                                <Td colSpan={3}>No rooms found for this floor.</Td>
                              </Tr>
                            )}
                          </Tbody>
                        </Table>
                      </AccordionPanel>
                    </AccordionItem>
                  ))
                ) : (
                  <Text>No floors found for this hotel.</Text>
                )}
              </Accordion>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default HotelRoomsTable;