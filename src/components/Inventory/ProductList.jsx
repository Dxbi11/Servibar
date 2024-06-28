// src/components/ProductList.js

import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Spinner,
  Text,
  VStack,
  Select,
  useToast,
} from "@chakra-ui/react";
import { getAllHotels, getProductsByHotelId } from "../api"; // Adjust the import path as necessary

const ProductList = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getAllHotels();
        setHotels(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error fetching the hotels.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchHotels();
  }, [toast]);

  useEffect(() => {
    if (selectedHotelId) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const data = await getProductsByHotelId(selectedHotelId);
          setProducts(data);
        } catch (error) {
          toast({
            title: "Error",
            description: "There was an error fetching the products.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [selectedHotelId, toast]);

  return (
    <Box p={4} borderWidth={1} borderRadius={8} boxShadow="lg">
      <Select
        placeholder="Select a hotel"
        value={selectedHotelId}
        onChange={(e) => setSelectedHotelId(e.target.value)}
        mb={4}
      >
        {hotels.map((hotel) => (
          <option key={hotel.id} value={hotel.id}>
            {hotel.name}
          </option>
        ))}
      </Select>

      {loading ? (
        <VStack mt={8}>
          <Spinner size="xl" />
          <Text>Loading products...</Text>
        </VStack>
      ) : (
        <Table variant="simple">
          <TableCaption>Products by Hotel</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th>Quantity</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>{product.name}</Td>
                <Td>{product.price}</Td>
                <Td>{product.quantity}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default ProductList;
