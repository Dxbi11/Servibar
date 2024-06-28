// src/components/AddProduct.js

import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { createProduct } from "../api"; // Adjust the import path as necessary
const AddProduct = ({ hotelId }) => {
  // Add hotelId as a prop
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const toast = useToast();

  const handleAddProduct = async () => {
    if (!name || !price || !hotelId) {
      // Check if all fields and hotelId are provided
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

        hotelId, // Add hotelId to the product data
      };
      console.log(productData);
      await createProduct(productData);
      toast({
        title: "Product added.",
        description: "The product has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Clear form
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
