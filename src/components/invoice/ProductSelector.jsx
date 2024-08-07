import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Text,
  VStack,
  HStack,
  Box,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { getProductById } from "../../api";

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
  <VStack spacing={4} align="stretch">
    <Text fontWeight="bold">Receipt preview</Text>
    {selectedProducts.map((product, index) => (
      <HStack key={`${product.id}-${index}`} justify="space-between">
        <Text>{product.name}</Text>
        <Text>${product.price?.toFixed(2) || "N/A"}</Text>
      </HStack>
    ))}
    <HStack justify="space-between">
      <Text fontWeight="bold">Total:</Text>
      <Text>${total.toFixed(2)}</Text>
    </HStack>
    <Button onClick={onReset} colorScheme="red" size="sm">
      Reset
    </Button>
  </VStack>
));

const ProductSelector = ({ hotelId }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProductsByHotelId(hotelId);
        setProducts(productsData);
      } catch (error) {
        toast({
          title: "Error fetching products",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [hotelId, toast]);

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
      <Box flex={1}>
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
