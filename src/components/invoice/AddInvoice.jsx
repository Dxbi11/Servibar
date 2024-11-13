import React, { useState, useContext, useEffect } from "react";
import { store } from "../../../store";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  useToast,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import useCreateInvoice from "../../hooks/InvoiceHooks/useCreateInvoice";
import useCreateRoomStock from "../../hooks/RoomStockHooks/useCreateRoomStock";
import ProductSelector from "./ProductSelector";
import { format } from "date-fns";
import { use } from "framer-motion/client";

const AddInvoice = () => {
  const { createData } = useCreateRoomStock();
  const { state } = useContext(store);
  const hotelId = state.ui.hotelId;
  const Allrooms = state.ui.AllRooms;
  const roomStocks = state.ui.roomStock;
  const [total, setTotal] = useState("");
  const [comment, setComment] = useState("");
  const [room, setRoom] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [invoiceRoomstock, setInvoiceRoomstock] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { handleSubmit, loading, error } = useCreateInvoice();
  const toast = useToast();

  const handleCommentChange = (newComment) => {
    setComment(newComment);
  };

  useEffect(() => {
    setAllProducts([]);
    setSelectedProducts([]);
  }, [hotelId]);

  const handleProductsSelected = (products) => {
    setSelectedProducts(products);
    setTotal(products.reduce((sum, product) => sum + (product.price * product.quantity || 0), 0).toFixed(2));
    setAllProducts([...new Set(products.map((product) => [product.name, product.id]))]);
  };
  
  const verifyRoom = (Room) => {
    const RoomData = Allrooms.find((room) => room.roomNumber == Room);
    if (!RoomData) {
      toast({
        title: "Room not found",
        description: "Room not found",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return null;
    }
    return RoomData;
  }

  const filterRoomstockOfRoom = (RoomData) => {
    const RoomStock = roomStocks.filter(stock => stock.roomId == RoomData.id);
    setInvoiceRoomstock(RoomStock);
  }

  // Trigger room stock processing whenever invoiceRoomstock updates
  useEffect(() => {
    if (invoiceRoomstock.length > 0) {
      allProducts.forEach((product) => {
        const roomStock = invoiceRoomstock.find((stock) => stock.productId == product[1]);
        console.log(roomStock);
        if (!roomStock) {
          createData(invoiceRoomstock[0].roomId, product[1], 1); // Assuming RoomData is the roomId for all products here
        }
      });
    }
  }, [invoiceRoomstock, allProducts, createData]);

  const onSubmit = (e) => {
    e.preventDefault();
    const RoomData = verifyRoom(room);
    if (!RoomData) return;
    filterRoomstockOfRoom(RoomData);
    const date = format(new Date(), "yyyy-MM-dd");

    const invoiceData = {
      total: parseFloat(total),
      date: date ? new Date(date) : undefined,
      hotelId: parseInt(hotelId),
      comment,
      room: parseInt(room),
    };
    handleSubmit(invoiceData, selectedProducts);

    setTotal("");
    setComment("");
    setRoom("");
  };

  return (
    <Box p={4} maxWidth="1200px" mx="auto">
      <form onSubmit={onSubmit}>
        <Grid templateColumns="2fr 1fr" gap={6}>
          <GridItem>
            <ProductSelector onProductsSelected={handleProductsSelected} />
          </GridItem>
          <GridItem>
            <VStack spacing={4}>
              <FormControl id="total" isRequired>
                <FormLabel>Total</FormLabel>
                <NumberInput
                  value={total}
                  onChange={(valueString) => setTotal(valueString)}
                  precision={2}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <FormControl id="comment">
                <FormLabel>Comment</FormLabel>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  onClick={() => handleCommentChange("in-House")}
                  variant="outline"
                  colorScheme={comment === "in-House" ? "blue" : "gray"}
                >
                  in-House
                </Button>
                <Button
                  onClick={() => handleCommentChange("Reported")}
                  variant="outline"
                  
                  colorScheme={comment === "Reported" ? "blue" : "gray"}
                >
                  Reported
                </Button>
              </FormControl>

              <FormControl id="room" isRequired>
                <FormLabel>Room</FormLabel>
                <NumberInput
                  value={room}
                  onChange={(valueString) => setRoom(valueString)}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
                Add Invoice
              </Button>
            </VStack>
          </GridItem>
        </Grid>
      </form>
    </Box>
  );
};

export default AddInvoice;
