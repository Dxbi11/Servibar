import React, { useState, useEffect, useContext } from "react";
import { store } from "../../../store";
import {
  Button,
  Grid,
  Text,
  VStack,
  HStack,
  Box,
  Spinner,
  useToast,
  Divider
} from "@chakra-ui/react";
import { getProductsByHotelId } from "../../api";

const ProductButton = React.memo(({ product, onSelect }) => (
  <Button
    onClick={() => onSelect(product)}
    colorScheme="blue"
    size="sm"
    variant="solid"
    width="100px"
    height="100px"
  >
    <VStack>
      <Text>{product.name}</Text>
      <Text fontSize="sm">${product.price?.toFixed(2) || "N/A"}</Text>
    </VStack>
  </Button>
));

const Receipt = React.memo(({ selectedProducts, total, onReset }) => (
  <VStack spacing={4} align="stretch" p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
    <Text fontWeight="bold" fontSize="xl" borderBottom="2px" borderColor="gray.200" pb={2}>
      Receipt Preview
    </Text>
    {selectedProducts.map((product, index) => (
      <HStack key={`${product.id}-${index}`} justify="space-between" py={1}>
        <Text fontWeight="medium">{product.name}</Text>
        <Text fontWeight="semibold">${product.price?.toFixed(2) || "N/A"}</Text>
      </HStack>
    ))}
    <Divider />
    <HStack justify="space-between" fontWeight="bold">
      <Text fontSize="lg">Total:</Text>
      <Text fontSize="lg" color="blue.600">${total.toFixed(2)}</Text>
    </HStack>
    <Button onClick={onReset} colorScheme="red" size="sm" mt={2}>
      Reset
    </Button>
  </VStack>
));

const ProductSelector = () => {
  const {state, dispatch} = useContext(store);
  const HotelId = state.ui.hotelId;
  const products = state.ui.products;
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();



  const handleProductSelect = React.useCallback((product) => {
    setSelectedProducts((prevSelected) => [...prevSelected, product]);
    setTotal((prevTotal) => prevTotal + (product.price || 0));
  }, []);

  const handleReset = React.useCallback(() => {
    setSelectedProducts([]);
    setTotal(0);
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <HStack spacing={8} align="stretch">
      <Box flex={1} mt={4}>
        <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={4}>
          {products.map((product) => (
            <ProductButton
              key={product.id}
              product={product}
              onSelect={handleProductSelect}
            />
          ))}
        </Grid>
      </Box>
      <Box flex={1}>
        <Receipt
          selectedProducts={selectedProducts}
          total={total}
          onReset={handleReset}
        />
      </Box>
    </HStack>
  );
};

export default ProductSelector;
