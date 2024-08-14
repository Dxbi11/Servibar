import React, { useState, useEffect, useContext } from 'react';
import { store } from '../../../store';
import {
  Editable,
  EditableInput,
  EditablePreview,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Th,
  Tr,
  Box,
  Text,
  Spinner,
} from "@chakra-ui/react";
import RowContent from './RowContent';

const TableStoreHouse = () => {
  const { state, dispatch } = useContext(store);
  const products = state.ui.products;
  const hotelId = state.ui.hotelId;
  const [inputQuantity, setInputQuantity] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [loading, setLoading] = useState(false); 


  useEffect(() => {
    if (products.length > 0) {
      setQuantity(products.map(() => 0));
      setLoading(false);
    }
  }, [products]);

  if (loading) {
    return (
      <Box p={4} bg="gray.50" borderRadius="md" boxShadow="md" textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading products...</Text>
      </Box>
    );
  }

  return (
  <Box p={6} bg="gray.50" borderRadius="md" boxShadow="lg" borderWidth="1px">
    <Editable defaultValue="Store House" mb={6}>
      <EditablePreview fontSize="3xl" fontWeight="bold" color="teal.600" />
      <EditableInput fontSize="lg" />
    </Editable>
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th fontWeight="bold" color="teal.800" borderBottomWidth="2px">Product</Th>
            <Th fontWeight="bold" color="teal.800" borderBottomWidth="2px">Quantity</Th>
            <Th fontWeight="bold" color="teal.800" borderBottomWidth="2px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product, index) => (
            <RowContent
              key={product.id}
              product={product}
              index={index}
              quantity={quantity}
              setQuantity={setQuantity}
              inputQuantity={inputQuantity}
              setInputQuantity={setInputQuantity}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  </Box>

  );
};

export default TableStoreHouse;
