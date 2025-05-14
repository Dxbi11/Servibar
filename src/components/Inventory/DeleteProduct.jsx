// src/components/DeleteProduct.js

import React, { useEffect, useState, useContext } from "react";
import { store } from "../../../store";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { getProductsByHotelId, deleteProduct, getAllProducts } from "../../api"; // Adjust the import path as necessary

const DeleteProduct = () => {
  const { state, dispatch } = useContext(store);
  const hotelId = state.ui.hotelId;
  const products = state.ui.products;
  const [selectedProduct, setSelectedProduct] = useState("");
  const toast = useToast();

  const handleDeleteProduct = async () => {
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product to delete.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }    try {
      const selectedProductId = parseInt(selectedProduct);
      await deleteProduct(selectedProductId);      // Update local state for immediate UI feedback
      dispatch({ type: "SET_PRODUCTS", payload: products.filter(p => p.id !== selectedProductId) });
      
      toast({
        title: "Product deleted.",
        description: "The product has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setSelectedProduct("");
      
      // Set a short timeout to allow the success toast to be visible before refreshing
      setTimeout(() => {
        // Refresh the whole page
        window.location.reload();
      }, 1500); // 1.5 seconds delay for the toast to be visible
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the product.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} borderWidth={1} borderRadius={8} boxShadow="lg">
      <VStack spacing={4}>
        <FormControl id="product" isRequired>
          <FormLabel>Select Product</FormLabel>
          <Select
            placeholder="Select product to delete"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button colorScheme="red" onClick={handleDeleteProduct}>
          Delete Product
        </Button>
      </VStack>
    </Box>
  );
};

export default DeleteProduct;
