import React, { useMemo, useState, useCallback } from 'react';
import { Flex, Text, Button, Box } from "@chakra-ui/react";
import StockButton from './StockButton';
import useDeleteRoomStock from '../../hooks/RoomStockHooks/useDeleteRoomStock';

const OptimizedStockRendering = ({ room, roomStocks, isLargerThan768 }) => {
  const { deleteData } = useDeleteRoomStock();
  const [selectedItems, setSelectedItems] = useState({});

  const handleProductClick = (productId, stockId) => {
    setSelectedItems((prev) => {
      const isSelected = prev[productId] ? prev[productId].includes(stockId) : false;
      return {
        ...prev,
        [productId]: isSelected
          ? prev[productId].filter(id => id !== stockId) // Desseleccionar
          : [...(prev[productId] || []), stockId], // Seleccionar
      };
    });

    console.log(selectedItems[productId]?.includes(stockId) 
      ? `Product ${productId} deselected`
      : `Product ${productId} selected`
    );
  };

  const handleConfirm = () => {
    Object.keys(selectedItems).forEach((productId) => {
      if (selectedItems[productId].length > 0) {
        selectedItems[productId].forEach(stockId => {
          deleteData(room.id, productId, stockId); // Llama a deleteData para cada stockId seleccionado
        });
      }
    });

    setSelectedItems({});
  };

  const relevantStocks = useMemo(() => {
    if (!roomStocks || roomStocks.length === 0) {
      return [];
    }

    return roomStocks.find(stock => stock.roomId === room.id)?.stocks || [];
  }, [room.id, roomStocks]);

  const memoizedStocks = useMemo(() => {
    return relevantStocks.map(stock => (
      <StockButton 
        key={stock.id}
        room={room}
        stock={stock}
        onClick={() => handleProductClick(stock.productId, stock.id)} // Manejar clic en el botón
        selected={selectedItems[stock.productId]?.includes(stock.id)} // Verificar si está seleccionado
      />
    ));
  }, [relevantStocks, selectedItems, room]);

  return (
    <Box>
      <Flex wrap="wrap" justifyContent="center" alignItems="center" maxWidth={isLargerThan768 ? "200px" : "150px"} mx="auto" mb={2}>
        {memoizedStocks.length > 0 ? memoizedStocks : (
          roomStocks ? <Text>No products left in this room</Text> : <Text>Loading products...</Text>
        )}
      </Flex>
      <Button
        onClick={handleConfirm}
        colorScheme="blue"
        size="sm"
        isDisabled={Object.values(selectedItems).every(v => v.length === 0)} // Habilitar si hay productos seleccionados
      >
        Confirm Stock Changes
      </Button>
    </Box>
  );
};

export default React.memo(OptimizedStockRendering);
