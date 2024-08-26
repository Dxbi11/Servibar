import React, { useContext, useState, useCallback } from "react";
import { store } from "../../../store";
import { Td, Tr, Button, ButtonGroup, Input, HStack } from "@chakra-ui/react";
import useUpdateStoreHouseData from "../../hooks/StoreHooks/useUpdateStoreHouse";

const RowContent = ({
  product,
  index,
  quantity,
  storeHouseId,
}) => {
  const { state } = useContext(store);
  const hotelId = state.ui.hotelId;
  const updateStoreHouseData = useUpdateStoreHouseData();
  const [inputValue, setInputValue] = useState("");

  const handleUpdateQuantity = useCallback((change) => {
    const inputNumber = parseInt(inputValue, 10);
    const newQuantity = quantity + (isNaN(inputNumber) ? change : inputNumber);
    
    setInputValue(""); // Clear the input after updating
    updateStoreHouseData(storeHouseId, { quantity: newQuantity });
  }, [inputValue, quantity, storeHouseId, updateStoreHouseData]);

  return (
    <Tr>
      <Td >{product.name}</Td>
      <Td>{quantity}</Td>
      <Td>
        <HStack spacing={2}>
        <Input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            min="0"
            bg="white" // Set background color to white
          />
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="teal" onClick={() => handleUpdateQuantity(1)}>
              +
            </Button>
            <Button colorScheme="red" onClick={() => handleUpdateQuantity(-1)}>
              -
            </Button>
          </ButtonGroup>
        </HStack>
      </Td>
    </Tr>
  );
};

export default RowContent;

