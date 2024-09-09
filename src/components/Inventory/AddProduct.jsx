// src/components/AddProduct.js

import React, { useState, useContext } from "react";
import { store } from "../../../store";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { createProduct } from "../../api"; 
import { createStoreHouse } from "../../api";
import useFetchStoreHouse from "../../hooks/StoreHooks/useFetchStoreHouse";
import useCreateRoomStock from "../../hooks/RoomStockHooks/useCreateRoomStock";

const AddProduct = () => {
  const { createData } = useCreateRoomStock();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const { state, dispatch } = useContext(store);
  const rooms = state.ui.rooms;
  const products = state.ui.products;
  const hotelId = parseInt(state.ui.hotelId, 10);
  const toast = useToast();
  const handleProducts = (productData) => {
    const updatedProducts = [...products, productData];
    dispatch({ type: "SET_PRODUCTS", payload: updatedProducts });
  };

  const handleStoreHouse = (StoreHouseData) => {
    const updatedStoreHouse = [...state.ui.storeHouse, StoreHouseData];
    dispatch({ type: "SET_STORE_HOUSE", payload: updatedStoreHouse });
  };

  const handleAddProduct = async () => {
    if (!name || !price || !hotelId) {
      toast({
        title: "Error",
        description: "Please fill in all the fields and provide a hotelId.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const productData = {
        name,
        price: parseFloat(price),
        hotelId,
      };
      // Primero creamos el producto y obtenemos su ID
      const createdProduct = await createProduct(productData);
      const productId = createdProduct.id; // Asumiendo que el ID es retornado aquí

      const StoreHouseData = {
        hotelId,
        quantity: 0,
        productId, // Ahora podemos usar el productId que obtuvimos
      };
      if (rooms.length > 0) {
      rooms.forEach(room => {
        
        const roomStock = {
          roomId: room.id,
          productId,
          quantity: 0,
        };
        console.log(roomStock);
        const roomStockCreated =  createData(roomStock.roomId, roomStock.productId, roomStock.quantity);
        console.log(roomStockCreated);
        });
      }
      // Luego creamos la entrada en StoreHouse
      await createStoreHouse(StoreHouseData);

      // Actualizamos el estado con los nuevos datos
      handleProducts(createdProduct); // Aquí usamos createdProduct que ya tiene el ID asignado
      handleStoreHouse(StoreHouseData);

      toast({
        title: "Product added.",
        description: "The product has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Limpiamos el formulario
      setName("");
      setPrice("");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding the product.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <Box p={4} borderWidth={1} borderRadius={8} boxShadow="lg">
      <VStack spacing={4}>
        <FormControl id="name" isRequired>
          <FormLabel>Product Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
          />
        </FormControl>
        <FormControl id="price" isRequired>
          <FormLabel>Price</FormLabel>
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter product price"
            type="number"
          />
        </FormControl>

        <Button colorScheme="blue" onClick={handleAddProduct}>
          Add Product
        </Button>
      </VStack>
    </Box>
  );
};
export default AddProduct;
