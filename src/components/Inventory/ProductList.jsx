import React, { useState, useEffect, useContext } from "react";
import { store } from "../../../store";
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
import useFetchInventory from "../../hooks/InventoryHooks/useFetchInventory";
import { useToast } from "@chakra-ui/react";
import ExportProductsToPDF from "../../hooks/FileExports/products/ExporPDFPrducts";
import ExportProductsToExcel from "../../hooks/FileExports/products/ExportExcelProducts";

const ProductList = ({ hotelId }) => {
  const { state, dispatch } = useContext(store);
  useFetchInventory();
  const products = state.ui.products;
  const toast = useToast();


  return (
    <div>
      <ExportProductsToPDF products={products} />
      <ExportProductsToExcel products={products} />
      <ExportProductsToPDF products={products} forPrint={true} />
      <Box p={4} borderWidth={1} borderRadius={8} boxShadow="lg">
        <Table variant="simple">
          <TableCaption>Products by Hotel</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Price</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>{product.name}</Td>
                <Td>{product.price}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </div>
  );
};

export default ProductList;
