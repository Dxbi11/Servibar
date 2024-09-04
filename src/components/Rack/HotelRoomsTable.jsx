import React, { useState, useEffect, useContext } from "react";
import { store } from "../../../store";
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
  Select,
  Button,
  Checkbox,
  Input,
  Flex,
} from "@chakra-ui/react";

import useFetchRooms from "../../hooks/RoomHooks/useFetchRooms";
import useUpdateRoomData from "../../hooks/RoomHooks/useUpdateRoomData";

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

const HotelRoomsTable = () => {
  const { isLoading, error } = useFetchRooms();
  const updateRoomData = useUpdateRoomData();
  const { state, dispatch } = useContext(store);
  const rooms = state.ui.rooms;
  const products = state.ui.products;

  const locks = ["Locked", "Unlocked"];
  const labels = ["Available", "In House", "Leaving", "Already Left"];

  const [selectedStatus, setSelectedStatus] = useState({});
  const [selectedLocked, setSelectedLocked] = useState({});
  const [accordionIndex, setAccordionIndex] = useState([0]); // Track open accordion panels
  const [openMissingItemsIndex, setOpenMissingItemsIndex] = useState({});
  const [productClickState, setProductClickState] = useState({});
  const [dailyCheck, setDailyCheck] = useState({});
  const [comments, setComments] = useState({});

  // ! Verify if the rooms are loaded correctly with checked and comment properties, if so, remove the console.log
  console.log(rooms);
  
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

  const handleDailyCheckChange = (room, isChecked) => {
    setDailyCheck((prevCheck) => ({ ...prevCheck, [room.id]: isChecked }));
    updateRoomData(room.id, { checked: isChecked }); // Ensure this API call is properly handling the update
  };
  
  const handleCommentChange = (room, e) => {
    const newComment = e.target.value;
    setComments((prevComments) => ({ ...prevComments, [room.id]: newComment }));
    updateRoomData(room.id, { comment: newComment }); // Ensure this API call is properly handling the update
  };
  

  const toggleMissingItemsAccordion = (roomId) => {
    setOpenMissingItemsIndex((prevIndex) => ({
      ...prevIndex,
      [roomId]: !prevIndex[roomId],
    }));
  };

  const handleProductClick = (roomId, productId) => {
    setProductClickState((prevState) => {
      const key = `${roomId}-${productId}`;
      const currentClickCount = prevState[key] || 0;

      if (currentClickCount === 1) {
        // Dispatch action to remove product after second click
        dispatch({
          type: "REMOVE_PRODUCT",
          payload: { productId },
        });

        // Reset the click state for the product
        const newState = { ...prevState };
        delete newState[key];
        return newState;
      }

      // Increase click count on first click
      return { ...prevState, [key]: currentClickCount + 1 };
    });
  };

  return (
    <Box p={4} bg="gray.50" borderRadius="md" boxShadow="md">
      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton
              _expanded={{ bg: "teal.500", color: "white" }}
              _hover={{ bg: "teal.400" }}
            >
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
                  <Th fontWeight="bold" color="gray.600" textAlign="center">
                    Room Number
                </Th>
                <Th fontWeight="bold" color="gray.600" textAlign="center">
                  Status
                </Th>
                <Th fontWeight="bold" color="gray.600" textAlign="center">
                  Locked
                </Th>
                <Th fontWeight="bold" color="gray.600" textAlign="center">
                  Missing items
                </Th>
                <Th fontWeight="bold" color="gray.600" textAlign="center">
                  Daily Check
                </Th>
                <Th fontWeight="bold" color="gray.600" textAlign="center">
                  Comments
                </Th>
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
                          value={selectedStatus[room.id] || room.state}
                          onChange={(e) => handleSelectChange(room, e)}
                          bg={getRoomStatus(selectedStatus[room.id] || room.state).color}
                          borderColor={getRoomStatus(selectedStatus[room.id] || room.state).color}
                          color="white"
                        >
                          {labels.map((label, index) => (
                            <option style={{ color: "black" }} key={index} value={index}>
                              {label}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td>
                        <Select
                          placeholder={room.locked ? "Locked" : "Unlocked"}
                          value={selectedLocked[room.id] || (room.locked ? "Locked" : "Unlocked")}
                          onChange={(e) => handleLockChange(room, e)}
                          bg={selectedLocked[room.id] === "Locked" || room.locked ? "red" : "green"}
                          borderColor={selectedLocked[room.id] === "Locked" || room.locked ? "red" : "green"}
                          color="white"
                        >
                          {locks.map((lock, index) => (
                            <option style={{ color: "black" }} key={index} value={lock}>
                              {lock}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td>
                        <Flex wrap="wrap" justifyContent="center">
                          {products.length > 0 ? products.map((product) => {
                            const productKey = `${room.id}-${product.id}`;
                            const clickCount = productClickState[productKey] || 0;

                            return (
                              <Button
                                key={product.id}
                                onClick={() => handleProductClick(room.id, product.id)}
                                bg={clickCount === 1 ? "red" : "white"}
                                color={clickCount === 1 ? "white" : "black"}
                                border="2px solid red"
                                borderRadius="12px"
                                p="4px 8px"
                                m="4px 2px"
                                display={clickCount === 2 ? "none" : "block"}
                              >
                                {product.name}
                              </Button>
                            );
                          }) : <Text>No products found</Text>}
                        </Flex>
                      </Td>
                      <Td>
                        <Flex justifyContent="center" alignItems="center">
                        <Checkbox
                          isChecked={dailyCheck[room.id] ?? room.checked} // Ensure it does not fallback to room.checked incorrectly
                          onChange={(e) => handleDailyCheckChange(room, e.target.checked)}
                        />
                        </Flex>
                      </Td>
                      <Td>
                        <Flex justifyContent="center" alignItems="center">
                        <Input
                          placeholder="Enter comments"
                          value={comments[room.id] ?? room.comment} // Use nullish coalescing to avoid fallback to undefined
                          onChange={(e) => handleCommentChange(room, e)}
                        />
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td colSpan={6}>
                        <Accordion
                          allowMultiple
                          index={openMissingItemsIndex[room.id] ? [0] : []}
                          onChange={() => toggleMissingItemsAccordion(room.id)}
                        >
                          <AccordionItem>
                            <h2>
                              <AccordionButton>
                                <Box flex="1" textAlign="left">
                                  <Text fontWeight="bold" color="gray.600">Missing Items Details</Text>
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              {/* Your missing items details content */}
                              <Text>No missing items for this room.</Text>
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
