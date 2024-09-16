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
  Tag,
  TagLabel,
  Flex,
} from "@chakra-ui/react";

import ExportToPDF from "../../hooks/FileExports/rack/ExportToPDFRack";

import useFetchRooms from "../../hooks/RoomHooks/useFetchRooms";
import useUpdateRoomData from "../../hooks/RoomHooks/useUpdateRoomData";
import useFetchRoomStock from "../../hooks/RoomStockHooks/useFetchRoomStock";
import useDeleteRoomStock from "../../hooks/RoomStockHooks/useDeleteRoomStock";
import useCreateRoomStock from "../../hooks/RoomStockHooks/useCreateRoomStock";

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
  const { state, dispatch } = useContext(store);
  const { isLoading: roomsLoading, error: roomsError } = useFetchRooms();
  const updateRoomData = useUpdateRoomData();
  const { isLoading: stockLoading, error: stockError } = useFetchRoomStock();
  const { deleteData, isLoading: deleteDataLoading, error: deleteDataError } = useDeleteRoomStock();
  const { createData, isLoading: createDataLoading, error: createDataError } = useCreateRoomStock();
  const [selectedStatus, setSelectedStatus] = useState({});
  const [selectedLocked, setSelectedLocked] = useState({});
  const [accordionIndex, setAccordionIndex] = useState([0]);
  const [openMissingItemsIndex, setOpenMissingItemsIndex] = useState({});
  const [productClickState, setProductClickState] = useState({});
  const [dailyCheck, setDailyCheck] = useState({});
  const [comments, setComments] = useState({});
  const [NotCheckedRooms, setNotCheckedRooms] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [missingItems, setMissingItems] = useState([]);

  const rooms = state.ui.rooms;
  const products = state.ui.products;
  const roomStocks = state.ui.roomStock;

  
  const locks = ["Locked", "Unlocked"];
  const labels = ["Available", "In House", "Leaving", "Already Left"];

  //Get the stocks for each room
  useEffect(() => {
    if (state.ui.roomStock.length > 0) {
      const newStocks = rooms.map((room) => {
        const filteredStock = state.ui.roomStock.filter((stock) => stock.roomId === room.id);
        return { roomId: room.id, stocks: filteredStock };
      });
      setStocks(newStocks);
    }
  }, [state.ui.roomStock, rooms]);

  //Get the missing items for each room
  useEffect(() => {
    if (stocks.length > 0) {
      const newMissingItems = stocks.map((roomStock) => {
        const roomMissingItems = products.filter((product) => 
          !roomStock.stocks.some((stock) => stock.productId === product.id)
        );
        return { roomId: roomStock.roomId, missingItems: roomMissingItems };
      });
      setMissingItems(newMissingItems);
    }
  }, [stocks, products]);


  useEffect(() => {
    const uncheckedCount = rooms.filter(room => !room.checked).length;
    setNotCheckedRooms(uncheckedCount);
  }, [rooms]);

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
    updateRoomData(room.id, { checked: isChecked });
  };
  
  const handleCommentChange = (room, e) => {
    const newComment = e.target.value;
    setComments((prevComments) => ({ ...prevComments, [room.id]: newComment }));
    updateRoomData(room.id, { comment: newComment });
  };
  

  const toggleMissingItemsAccordion = (roomId) => {
    setOpenMissingItemsIndex((prevIndex) => ({
      ...prevIndex,
      [roomId]: !prevIndex[roomId],
    }));
  };

  const handleProductClick = (roomId, productId, stockId) => {
    deleteData(roomId, productId, stockId);
  };

  const handleItemClick = (roomId, itemId, quantity) => {
    createData(roomId, itemId, quantity);
  };

  if (roomsLoading || stockLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (roomsError || stockError) {
    return (
      <Center h="100vh">
        <Text color="red.500">{roomsError || stockError}</Text>
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
    <Box p={4} bg="gray.50" borderRadius="md" boxShadow="md">
      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton
              _expanded={{ bg: "teal.500", color: "white" }}
              _hover={{ bg: "teal.400" }}
            >
              <Flex direction="row" justify="space-between" align="center" width="100%">
                <Text fontWeight="bold" mr={4}>Selected Hotel</Text>
                <Tag mr={2} ml={4} size='lg' colorScheme='red' borderRadius='full' display={NotCheckedRooms > 0 ? "flex" : "none"}>
                  <Box mr={2} as="b">{NotCheckedRooms}</Box>
                  <TagLabel>Rooms not checked</TagLabel>
                </Tag>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <ExportToPDF rooms={rooms} roomStocks={roomStocks} />
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
                {rooms.map((room, index) => {
                  const RowColor = room.checked ? "white" : "red.400";
                  return (
                    <React.Fragment key={room.id}>
                      <Tr key={room.id} backgroundColor={RowColor}>
                        <Td textAlign="center">{room.roomNumber}</Td>
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
                            {roomStocks ? (
                              roomStocks.length > 0 ? (
                                Array.isArray(roomStocks[0]) 
                                  ? (roomStocks[index] || []).map((stock) => (
                                      <StockButton 
                                        key={stock.id} 
                                        room={room} 
                                        stock={stock} 
                                        productClickState={productClickState} 
                                        handleProductClick={handleProductClick} 
                                      />
                                    ))
                                  : (roomStocks.filter(stock => stock.roomId === room.id) || []).map((stock) => (
                                      <StockButton 
                                        key={stock.id} 
                                        room={room} 
                                        stock={stock} 
                                        productClickState={productClickState} 
                                        handleProductClick={handleProductClick} 
                                      />
                                    ))
                              ) : (
                                <Text>No products left in this room</Text>
                              )
                            ) : (
                              <Text>Loading products...</Text>
                            )}
                          </Flex>
                        </Td>
                        <Td>
                          <Flex justifyContent="center" alignItems="center">
                          <Checkbox
                            isChecked={dailyCheck[room.id] ?? room.checked}
                            onChange={(e) => handleDailyCheckChange(room, e.target.checked)}
                          />
                          </Flex>
                        </Td>
                        <Td>
                          <Flex justifyContent="center" alignItems="center">
                          <Input
                            placeholder="Enter comments"
                            value={comments[room.id] ?? room.comment}
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
                                <MissingItemButton roomId={room.id} missingItems={missingItems} handleItemClick={handleItemClick} />
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>
                        </Td>
                      </Tr>
                    </React.Fragment>
                  );
                })}
              </Tbody>
            </Table>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default HotelRoomsTable;

const StockButton = ({ room, stock, productClickState, handleProductClick }) => {
  const productKey = `${room.id}-${stock.productId}`;
  const clickCount = productClickState[productKey] || 0;
  return (
    <Button
      onClick={() => handleProductClick(room.id, stock.productId, stock.id)}
      bg={clickCount === 1 ? "red" : "white"}
      color={clickCount === 1 ? "white" : "black"}
      border="2px solid red"
      borderRadius="12px"
      p="4px 8px"
      m="4px 2px"
      display={clickCount === 2 ? "none" : "block"}
    >
      {stock.product?.name || 'Unknown Product'}
    </Button>
  );
};

const MissingItemButton = ({ roomId, missingItems, handleItemClick }) => {
  const filteredMissingItems = missingItems.find(item => item.roomId === roomId);

  if (!filteredMissingItems) return null;

  return (
    <>
      {filteredMissingItems.missingItems.map((missingItem) => (
        <Button
          key={missingItem.id}
          onClick={() => handleItemClick(roomId, missingItem.id, 1)}
          bg="white"
          color="black"
          border="2px solid green"
          borderRadius="12px"
          p="4px 8px"
          m="4px 2px"
        >
          {missingItem.name || 'Missing Item'}
        </Button>
      ))}
    </>
  );
};