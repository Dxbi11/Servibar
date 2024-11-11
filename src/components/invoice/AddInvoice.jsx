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
import useDeleteRoomStock from '../../hooks/RoomStockHooks/useDeleteRoomStock';
import ProductSelector from "./ProductSelector";
import { format } from "date-fns";
import { use } from "framer-motion/client";

const AddInvoice = () => {
  const { deleteData } = useDeleteRoomStock();
  const { state } = useContext(store);
  const hotelId = state.ui.hotelId;
  const rooms = state.ui.rooms;
  console.log(hotelId);
  const [total, setTotal] = useState("");
  const [comment, setComment] = useState("");
  const [room, setRoom] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const { handleSubmit, loading, error } = useCreateInvoice();
  const toast = useToast();
  const handleCommentChange = (newComment) => {
    setComment(newComment);
  };

  useEffect(() => {
    // Al cambiar el hotelId, se limpian los productos seleccionados y todos los productos
    setAllProducts([]);
    setSelectedProducts([]);
  }, [hotelId]);

  const handleProductsSelected = (products) => {
    setSelectedProducts(products);
    setTotal(products.reduce((sum, product) => sum + (product.price * product.quantity || 0), 0).toFixed(2));
    
    // Actualizar allProducts con nombres únicos al seleccionar productos
    setAllProducts([...new Set(products.map((product) => {product.name, product.id}))]);
  };
  
  console.log(allProducts);
  const onSubmit = (e) => {
    const date = format(new Date(), "yyyy-MM-dd");
    e.preventDefault();
    const invoiceData = {
      total: parseFloat(total),
      date: date ? new Date(date) : undefined,
      hotelId: parseInt(hotelId),
      comment,
      room: parseInt(room),
    };
    handleSubmit(invoiceData, selectedProducts);
    // ! 1. Verificar si room existe
    // ! 2. Obtener RoomStocks de Room
    // ! 3. Map de All products en los RoomStocks con ProductId
    // allProducts.forEach((product) => {
    //   deleteData(hotelId, product);
    // });
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
