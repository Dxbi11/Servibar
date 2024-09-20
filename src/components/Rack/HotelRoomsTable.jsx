import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
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
  Tag,
  Flex,
  useMediaQuery,
  Center,
  Select,
  Checkbox,
  Input,
  TagLabel,
  Textarea,
} from "@chakra-ui/react";

import ExportToPDF from "../../hooks/FileExports/rack/ExportToPDFRack";
import ExportToExcel from "../../hooks/FileExports/rack/ExportToExcelRack";
import MissingItemButton from "./MissingItemButton";
import OptimizedStockRendering from "./OptimizedStockRendering";
import useUpdateRoomData from "../../hooks/RoomHooks/useUpdateRoomData";

const getRoomStatus = (state) => {
  const statuses = {
    0: { label: "Available", color: "green" },
    1: { label: "In House", color: "blue" },
    2: { label: "Leaving", color: "orange" },
    3: { label: "Already Left", color: "red" },
  };
  return statuses[state] || { label: "Unknown", color: "gray" };
};

const HotelRoomsTable = () => {
  const { state } = useContext(store);
  const updateRoomData = useUpdateRoomData();
  
  const [statusState, setStatusState] = useState({});
  const [lockedState, setLockedState] = useState({});
  const [dailyCheck, setDailyCheck] = useState({});
  const [comments, setComments] = useState({});
  const [openMissingItemsIndex, setOpenMissingItemsIndex] = useState({});
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const { rooms, products, roomStock } = state.ui;

  const stocks = useMemo(() => 
    rooms.map((room) => ({
      roomId: room.id,
      stocks: roomStock.filter((stock) => stock.roomId === room.id),
    })), [rooms, roomStock]);

  const missingItems = useMemo(() => 
    stocks.map((roomStock) => ({
      roomId: roomStock.roomId,
      missingItems: products.filter((product) => 
        !roomStock.stocks.some((stock) => stock.productId === product.id)
      ),
    })), [stocks, products]);

  const notCheckedRooms = useMemo(() => 
    rooms.filter(room => !room.checked).length, [rooms]);

  const handleSelectChange = useCallback((room, newState) => {
    setStatusState(prev => ({ ...prev, [room.id]: newState }));
    updateRoomData(room.id, { state: newState });
  }, [updateRoomData]);

  const handleLockChange = useCallback((room, newLockState) => {
    setLockedState(prev => ({ ...prev, [room.id]: newLockState }));
    updateRoomData(room.id, { locked: newLockState === "Locked" });
  }, [updateRoomData]);

  const handleDailyCheckChange = useCallback((room, isChecked) => {
    setDailyCheck(prev => ({ ...prev, [room.id]: isChecked }));
    updateRoomData(room.id, { checked: isChecked });
  }, [updateRoomData]);

  const handleCommentChange = useCallback((room, newComment) => {
    setComments(prev => ({ ...prev, [room.id]: newComment }));
    updateRoomData(room.id, { comment: newComment });
  }, [updateRoomData]);

  const toggleMissingItemsAccordion = useCallback((roomId) => {
    setOpenMissingItemsIndex(prev => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  }, []);

  if (rooms.length === 0) {
    return (
      <Center h="100vh">
        <Text>No rooms found for this hotel.</Text>
      </Center>
    );
  }

  return (
    <Box p={4} bg="gray.50" borderRadius="md" boxShadow="md" overflowX="auto">
      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton _expanded={{ bg: "teal.500", color: "white" }} _hover={{ bg: "teal.400" }}>
              <Flex direction={isLargerThan768 ? "row" : "column"} justify="space-between" align="center" width="100%">
                <Text fontWeight="bold" mr={4}>Selected Hotel</Text>
                <Tag mr={2} ml={4} size='lg' colorScheme='red' borderRadius='full' display={notCheckedRooms > 0 ? "flex" : "none"}>
                  <Box mr={2} as="b">{notCheckedRooms}</Box>
                  <TagLabel>Rooms not checked</TagLabel>
                </Tag>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex justifyContent="center" mb={4}>
              <ExportToPDF rooms={rooms} roomStocks={roomStock} />
              <ExportToExcel rooms={rooms} roomStocks={roomStock} />
            </Flex>
            <Table variant="simple" size={isLargerThan768 ? "md" : "sm"}>
              <Thead>
                <Tr>
                  <Th fontWeight="bold" color="gray.600" textAlign="center">Room Number</Th>
                  <Th fontWeight="bold" color="gray.600" textAlign="center">Status</Th>
                  <Th fontWeight="bold" color="gray.600" textAlign="center">Locked</Th>
                  <Th fontWeight="bold" color="gray.600" textAlign="center">Missing items</Th>
                  <Th fontWeight="bold" color="gray.600" textAlign="center">Daily Check</Th>
                  <Th fontWeight="bold" color="gray.600" textAlign="center">Comments</Th>
                </Tr>
              </Thead>
              <Tbody>
                {rooms.map((room) => (
                  <React.Fragment key={room.id}>
                    <Tr backgroundColor={room.checked ? "white" : "red.100"}>
                      <Td textAlign="center">{room.roomNumber}</Td>
                      <Td>
                        <Select
                          placeholder={getRoomStatus(room.state).label}
                          value={statusState[room.id] || room.state}
                          onChange={(e) => handleSelectChange(room, parseInt(e.target.value, 10))}
                          bg={getRoomStatus(statusState[room.id] || room.state).color}
                          borderColor={getRoomStatus(statusState[room.id] || room.state).color}
                          color="white"
                          size={isLargerThan768 ? "md" : "sm"}
                        >
                          {["Available", "In House", "Leaving", "Already Left"].map((label, index) => (
                            <option key={index} style={{ color: "black" }} value={index}>
                              {label}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td>
                        <Select
                          placeholder={room.locked ? "Locked" : "Unlocked"}
                          value={lockedState[room.id] || (room.locked ? "Locked" : "Unlocked")}
                          onChange={(e) => handleLockChange(room, e.target.value)}
                          bg={lockedState[room.id] === "Locked" || room.locked ? "red" : "green"}
                          borderColor={lockedState[room.id] === "Locked" || room.locked ? "red" : "green"}
                          color="white"
                          size={isLargerThan768 ? "md" : "sm"}
                        >
                          {["Locked", "Unlocked"].map((lock, index) => (
                            <option key={index} style={{ color: "black" }} value={lock}>
                              {lock}
                            </option>
                          ))}
                        </Select>
                      </Td>
                      <Td textAlign="center" verticalAlign="middle">
                        <OptimizedStockRendering
                          room={room}
                          roomStocks={roomStock}
                          isLargerThan768={isLargerThan768}
                        />
                      </Td>
                      <Td>
                        <Flex justifyContent="center" alignItems="center">
                          <Checkbox
                            isChecked={dailyCheck[room.id] ?? room.checked}
                            onChange={(e) => handleDailyCheckChange(room, e.target.checked)}
                            size={isLargerThan768 ? "md" : "sm"}
                          />
                        </Flex>
                      </Td>
                      <Td>
                        <Textarea
                              placeholder="Enter comments"
                              value={comments[room.id] ?? room.comment}
                              onChange={(e) => handleCommentChange(room, e)}
                              minH={isLargerThan768 ? "100px" : "80px"}
                              maxH={isLargerThan768 ? "200px" : "150px"}
                              minW={isLargerThan768 ? "150px" : "100px"}
                              maxW={isLargerThan768 ? "300px" : "200px"}
                              w="100%"
                              size={isLargerThan768 ? "sm" : "xs"}
                              resize="both"
                              borderColor="gray.300"
                              _hover={{ borderColor: "gray.400" }}
                              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                            />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td colSpan={6}>
                        <MissingItemButton
                          roomId={room.id}
                          missingItems={missingItems.find(item => item.roomId === room.id)?.missingItems}
                          open={openMissingItemsIndex[room.id]}
                          onToggle={() => toggleMissingItemsAccordion(room.id)}
                        />
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

export default React.memo(HotelRoomsTable);
