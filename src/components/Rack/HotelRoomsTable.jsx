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
  Button
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

const locks = ["Locked", "Unlocked"];

const HotelRoomsTable = () => {
  const { state, dispatch } = useContext(store);
  const {updateRoomData} = useUpdateRoomData();
  const [selectedLocked, setSelectedLocked] = useState({});
  const [statusState, setStatusState] = useState({});
  const [lockedState, setLockedState] = useState({});
  const [dailyCheck, setDailyCheck] = useState({});
  const [comments, setComments] = useState({});
  const [pendingComments, setPendingComments] = useState({});
  const [openMissingItemsIndex, setOpenMissingItemsIndex] = useState({});
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const rooms = state.ui.rooms;
  const roomStock = state.ui.roomStock;
  const products = state.ui.products;

  const stocks = useMemo(() => 
    rooms.map((room) => ({
      roomId: room.id,
      stocks: roomStock.filter((stock) => stock.roomId === room.id),
    })), [rooms, roomStock]);

    const missingItems = useMemo(() => {
      if (stocks.length > 0 && products.length > 0) {
    
        return stocks.map((roomStock) => {
          
    
          // Filtra los productos que no están presentes en el stock de la habitación
          const roomMissingItems = products.filter((product) => 
            !roomStock.stocks.some((stock) => stock.productId === product.id)
          );
    
          
    
          return {
            roomId: roomStock.roomId,
            missingItems: roomMissingItems,
          };
        });
      }
    
      // Retorna un array vacío si no hay stocks o productos
      return [];
    }, [stocks, products]);
    
    
    
  const notCheckedRooms = useMemo(() => 
    rooms.filter(room => !room.checked).length, [rooms]);

  const handleRoomChange = useCallback((room, updates) => {
    console.log("Room data to update:", room, updates);
    const storeData = {
      ...room, // Copiamos las propiedades del cuarto
      ...updates // Aplicamos las actualizaciones
    };
    
    // Actualizamos el estado y el store
    dispatch({ type: "UPDATE_ROOM", payload: storeData });
    updateRoomData(room, updates);
  
    // Actualizamos el estado local si es necesario
    if (updates.state !== undefined) {
      setStatusState(prev => ({ ...prev, [room.id]: updates.state }));
    }
    if (updates.locked !== undefined) {
      setLockedState(prev => ({ ...prev, [room.id]: updates.locked }));
    }
    
    if (updates.checked !== undefined) {
      setDailyCheck(prev => ({ ...prev, [room.id]: updates.checked }));
    }
    if (updates.comment !== undefined) {
      setComments(prev => ({ ...prev, [room.id]: updates.comment }));
    }
  }, [updateRoomData]);
  
  // Funciones individuales para cada acción
  const handleSelectChange = (room, newState) => handleRoomChange(room, { state: newState });
  const handleLockChange = (room, e) => {
    const newLockState = e.target.value === "Locked";
    setSelectedLocked((prevLocked) => ({ ...prevLocked, [room.id]: e.target.value }));
    handleRoomChange(room, { locked: newLockState });
  };
  
  const handleDailyCheckChange = (room, isChecked) => handleRoomChange(room, { checked: isChecked });
  const handleCommentChange = (room, e) => {
    const newComment = e.target.value;
    setPendingComments((prevComments) => ({ ...prevComments, [room.id]: newComment }));
  }

  const handleConfirmComment = (room) => {
    const newComment = pendingComments[room.id];
    setComments((prevComments) => ({ ...prevComments, [room.id]: newComment }));
    handleRoomChange(room, { comment: newComment });
    setPendingComments((prevPending) => ({ ...prevPending, [room.id]: undefined }));
  }
  

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
              <ExportToPDF  rooms={rooms} roomStocks={roomStock} forPrint={true}/>
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
                          value={selectedLocked[room.id] || (room.locked ? "Locked" : "Unlocked")}
                          onChange={(e) => handleLockChange(room, e)} // Cambiado a e.target.value
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

                      <Td textAlign="center" verticalAlign="middle">
                        <OptimizedStockRendering
                          room={room}
                          roomStocks={stocks}
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
                        <Flex>
                          <Textarea
                            placeholder="Enter comments"
                            value={pendingComments[room.id] ?? comments[room.id] ?? room.comment ?? ''}
                            onChange={(e) => handleCommentChange(room, e)}
                            mr={2}
                          />
                          <Button
                            colorScheme="teal"
                            size="sm"
                            onClick={() => handleConfirmComment(room)}
                            isDisabled={!pendingComments[room.id]}
                          >
                            Confirm
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td colSpan={6}>
                      <MissingItemButton roomId={room.id} missingItems={missingItems}/>
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
