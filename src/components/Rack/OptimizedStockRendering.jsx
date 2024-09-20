import React, { useMemo } from 'react';
import { Flex, Text } from "@chakra-ui/react";
import StockButton from './StockButton';

const OptimizedStockRendering = ({ room, roomStocks, isLargerThan768 }) => {
  const memoizedStocks = useMemo(() => {
    if (!roomStocks || roomStocks.length === 0) {
      return null;
    }

    const relevantStocks = Array.isArray(roomStocks[0])
      ? roomStocks[room.id] || []
      : roomStocks.filter(stock => stock.roomId === room.id);

    return relevantStocks.map((stock) => (
      <StockButton 
        key={stock.id} 
        room={room} 
        stock={stock} 
      />
    ));
  }, [room.id, roomStocks]);

  return (
    <Flex wrap="wrap" justifyContent="center" alignItems="center" maxWidth={isLargerThan768 ? "200px" : "150px"} mx="auto">
      {memoizedStocks ? memoizedStocks : (
        roomStocks ? <Text>No products left in this room</Text> : <Text>Loading products...</Text>
      )}
    </Flex>
  );
};

export default React.memo(OptimizedStockRendering);