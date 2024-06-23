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
import { getHotelById, getAllFloors } from '../api'; // Import the API functions

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
    const fetchData = async () => {
      try {
        // Fetch all floors
        const floorsData = await getAllFloors();

        // Group floors by hotelId
        const floorsByHotel = floorsData.reduce((acc, floor) => {
          if (!acc[floor.hotelId]) {
            acc[floor.hotelId] = [];
          }
          acc[floor.hotelId].push(floor);
          return acc;
        }, {});

        // Fetch hotel details for each unique hotelId
        const hotelPromises = Object.keys(floorsByHotel).map(async (hotelId) => {
          const hotelData = await getHotelById(hotelId);
          return {
            ...hotelData,
            floors: floorsByHotel[hotelId],
          };
        });

        const hotelsData = await Promise.all(hotelPromises);
        setHotels(hotelsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load hotel data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
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
              {hotel.floors && hotel.floors.length > 0 ? (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Floor</Th>
                      <Th>Room Number</Th>
                      <Th>Status</Th>
                      <Th>Locked</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {hotel.floors.map((floor) => (
                      <React.Fragment key={floor.id}>
                        <Tr>
                          <Td colSpan={4} bg="gray.100">
                            <Text fontWeight="semibold">Floor {floor.floorNumber}</Text>
                          </Td>
                        </Tr>
                        {floor.rooms && floor.rooms.length > 0 ? (
                          floor.rooms.map((room) => {
                            const status = getRoomStatus(room.state);
                            return (
                              <Tr key={room.id}>
                                <Td></Td>
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
                            <Td colSpan={4}>No rooms found for this floor.</Td>
                          </Tr>
                        )}
                      </React.Fragment>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Text>No floors found for this hotel.</Text>
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default HotelRoomsTable;