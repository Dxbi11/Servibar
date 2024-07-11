import React, { useState, useEffect } from 'react';
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
  Text
} from "@chakra-ui/react";
import RowContent from './RowContent';
import UseStoreHouse from './UseStoreHouse';

const TableStoreHouse = () => {
  const products = UseStoreHouse();
  const [inputQuantity, setInputQuantity] = useState([]);
  const [quantity, setQuantity] = useState([]);

  useEffect(() => {
    if (products.length > 0 && quantity.length === 0) {
      setQuantity(products.map(() => 0));
    }
  }, [products]);

  return (
    <Box p={4} bg="gray.50" borderRadius="md" boxShadow="md">
      <Editable defaultValue="Store House" mb={4}>
        <EditablePreview fontSize="2xl" fontWeight="bold" />
        <EditableInput />
      </Editable>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th fontWeight="black" color="black">Product</Th>
              <Th fontWeight="black" color="black">Quantity</Th>
              <Th fontWeight="black" color="black">Actions</Th>
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
