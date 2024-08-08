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
  Select
} from "@chakra-ui/react";

import { getRoomsByHotelId, updateRoom } from "../../api";
import TableStoreHouse from "../StoreHouse/TableStoreHouse";

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
  const locks = ["Locked", "Unlocked"];
  const labels = ["Available", "In House", "Leaving", "Already Left"];
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedLocked, setSelectedLocked] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const roomsData = await getRoomsByHotelId(hotelId);
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
  }, [selectedStatus, selectedLocked]);
  //commit
  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
  const updateRoomData = async (roomId, roomData) => {
    try {
      await updateRoom(roomId, roomData);
    } catch (error) {
      console.error("Failed to update room:", error);
    }
  };
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
  const handleSelectChange = (room, e) => {
    const newState = parseInt(e.target.value, 10);
    setSelectedStatus((prevStatus) => ({ ...prevStatus, [room.id]: newState }));
    updateRoomData(room.id, { state: newState });
  };

  const handleLockChange = (room, e) => {
    const newLockState = e.target.value === "Locked";
    setSelectedLocked((prevLocked) => ({ ...prevLocked, [room.id]: e.target.value }));
    updateRoomData(room.id, { locked: newLockState });
  };
  return (
    <Box p={4} bg="gray.50" borderRadius="md" boxShadow="md">
      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton _expanded={{ bg: "teal.500", color: "white" }} _hover={{ bg: "teal.400" }}>
              <Box flex="1" textAlign="left">
                <Text fontWeight="bold">Selected Hotel</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th fontWeight="bold" color="gray.600">Room Number</Th>
                  <Th fontWeight="bold" color="gray.600">Status</Th>
                  <Th fontWeight="bold" color="gray.600">Locked</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rooms.map((room) => (
                  <React.Fragment key={room.id}>
                    <Tr key={room.id}>
                    <Td>{room.roomNumber}</Td>
                    <Td>
                    <Select
                      placeholder={getRoomStatus(room.state).label}
                      value={selectedStatus[room.id] || ''}
                      onChange={(e) => handleSelectChange(room, e)}
                      bg={getRoomStatus(room.state).color}
                      borderColor={getRoomStatus(room.state).color}
                      color="white"
                    >
                      {labels.map((label, index) => (
                        <option style={{ color: 'black' }} key={index} value={index}>
                          {label}
                        </option>
                      ))}
                      </Select>
                    </Td>
                    <Td>
                    <Select
                      placeholder={room.locked ? "Locked" : "Unlocked"}
                      value={selectedLocked[room.id] || ''}
                      onChange={(e) => handleLockChange(room, e)}
                      bg={room.locked ? "red" : "green"}
                      borderColor={room.locked ? "red" : "green"}
                      color="white"
                    >
                      {locks.map((lock, index) => (
                        <option style={{ color: 'black' }} key={index} value={lock}>
                          {lock}
                        </option>
                      ))}
                    </Select>
                    </Td>
                  </Tr>
                    <Tr>
                      <Td colSpan={3}>
                        <Accordion>
                          <AccordionItem>
                            <h2>
                              <AccordionButton>
                                <Box as='span' flex='1' textAlign='left'>
                                  Open room details
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              <TableStoreHouse />
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      </Td>
                    </Tr>
                  </React.Fragment>
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
