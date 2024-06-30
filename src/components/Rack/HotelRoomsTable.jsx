import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";

import { getRoomsByHotelId } from "../api"; // Import the API function

const getRoomStatus = (state) => {
  switch (state) {
    case 0:
      return { label: "Available", color: "green" };
    case 1:
      return { label: "In House", color: "blue" };
    case 2:
      return { label: "Leaving", color: "orange" };
    case 3:
      return { label: "Already Left", color: "red" };
    default:
      return { label: "Unknown", color: "gray" };
  }
};

const HotelRoomsTable = ({ hotelId, roomId }) => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const roomsData = await getRoomsByHotelId(hotelId);
      console.log(roomsData);
      setRooms(roomsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load room data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hotelId]);

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

  if (rooms.length === 0) {
    return (
      <Center h="100vh">
        <Text>No rooms found for this hotel.</Text>
      </Center>
    );
  }

  return (
    <Box>
      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold">selected hotel</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
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
                {rooms.map((room) => (
                  <Tr key={room.id}>
                    <Td>{room.roomNumber}</Td>
                    <Td>
                      <Badge colorScheme={getRoomStatus(room.state).color}>
                        {getRoomStatus(room.state).label}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={room.locked ? "red" : "green"}>
                        {room.locked ? "Locked" : "Unlocked"}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default HotelRoomsTable;
