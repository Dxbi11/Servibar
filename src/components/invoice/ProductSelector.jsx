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

const getColorFromId = (id) => {
  const hue = (id * 137.508) % 360; // Simple hash function
  return `hsl(${hue}, 70%, 80%)`;
};

const ProductButton = React.memo(({ product, onSelect }) => (
  <Button
    onClick={() => onSelect(product)}
    bg={getColorFromId(product.id)}
    _hover={{ bg: getColorFromId(product.id), opacity: 0.8 }}
    size="sm"
    variant="solid"
    width="100%"
    height="0"
    paddingBottom="100%" // This maintains the square aspect ratio
    position="relative"
    overflow="hidden"
    p={1} // Reduce padding to allow more space for text
    minHeight="80px" // Add minimum height
  >
    <VStack
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      justify="space-between"
      align="center"
      spacing={0}
      p={1} // Add padding to VStack for better text positioning
    >
      <Text 
        fontWeight="bold" 
        fontSize={["2xs", "xs", "sm"]} 
        lineHeight="1.2"
        textAlign="center"
        width="100%"
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {product.name}
      </Text>
      <Text fontSize={["3xs", "2xs", "xs"]} fontWeight="semibold">
        ${product.price?.toFixed(2) || "N/A"}
      </Text>
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

const ProductSelector = ({ onProductsSelected }) => {
  const {state, dispatch} = useContext(store);
  const HotelId = state.ui.hotelId;
  const products = state.ui.products;
  const [selectedProducts, setSelectedProducts] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleProductSelect = React.useCallback((product) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (newSelected[product.id]) {
        newSelected[product.id].quantity += 1;
      } else {
        newSelected[product.id] = { ...product, quantity: 1 };
      }
      onProductsSelected(Object.values(newSelected));
      return newSelected;
    });
    setTotal((prevTotal) => prevTotal + (product.price || 0));
  }, [onProductsSelected]);

  const handleReset = React.useCallback(() => {
    setSelectedProducts({});
    setTotal(0);
    onProductsSelected([]);
  }, [onProductsSelected]);

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
        <Grid templateColumns="repeat(auto-fill, minmax(80px, 1fr))" gap={2}>
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
          selectedProducts={Object.values(selectedProducts)}
          total={total}
          onReset={handleReset}
        />
      </Box>
    </HStack>
  );
};

export default ProductSelector;
