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
import useFetchStoreHouse from '../../hooks/StoreHooks/useFetchStoreHouse';

const TableStoreHouse = () => {
  useFetchStoreHouse();
  const { state, dispatch } = useContext(store);
  const products = state.ui.products;
  const hotelId = state.ui.hotelId;
  const storeHouse = state.ui.storeHouse || []; // Default to empty array if undefined
  const [loading, setLoading] = useState(false);

  const sortedStoreHouse = [...storeHouse].sort((a, b) => a.productId - b.productId);
  const sortedProducts = [...products].sort((a, b) => a.id - b.id);

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
          {sortedStoreHouse.length > 0 && sortedStoreHouse.map((row, index) => {
              return (
              <RowContent
                key={row.id}
                product={sortedProducts[index]}
                index={index}
                quantity={row.quantity}
                storeHouseId={row.id} // Correct prop name
              />
            );
          })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableStoreHouse;
