import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { getProductsByHotelId } from "../../api"; // Adjust the import path as necessary
import { useToast } from "@chakra-ui/react";

const ProductList = ({ hotelId }) => {
  const [products, setProducts] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByHotelId(hotelId);
        setProducts(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error fetching the products.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchProducts();
  }, [hotelId, toast, products]);

  return (
    <Box p={4} borderWidth={1} borderRadius={8} boxShadow="lg">
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
    </Box>
  );
};

export default ProductList;
