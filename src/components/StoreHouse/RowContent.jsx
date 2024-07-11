import React from "react";
import {
  Td,
  Tr,
  Button,
  ButtonGroup,
  Input,
  HStack
} from "@chakra-ui/react";

const RowContent = ({ product, index, quantity, setQuantity, inputQuantity, setInputQuantity }) => {
  const handleInput = (e) => {
    const newQuantity = [...inputQuantity];
    newQuantity[index] = e.target.value;
    setInputQuantity(newQuantity);
  };

  return (
    <Tr>
      <Td fontWeight="medium">{product.name}</Td>
      <Td>{quantity[index]}</Td>
      <Td>
        <ButtonGroup size="sm" isAttached>
          <Button
            colorScheme="teal"
            onClick={() => setQuantity((quantity) => {
              const newQuantity = [...quantity];
              newQuantity[index] += 1;
              return newQuantity;
            })}
          >
            +
          </Button>
          <Button
            colorScheme="red"
            onClick={() => setQuantity((quantity) => {
              const newQuantity = [...quantity];
              if (newQuantity[index] > 0) {
                newQuantity[index] -= 1;
              }
              return newQuantity;
            })}
          >
            -
          </Button>
          <HStack spacing={2}>
            <Input
              type="number"
              value={inputQuantity[index] || ''}
              onChange={handleInput}
              placeholder="🔢 Enter Quantity"
              width="100px"
            />
            <Button
              colorScheme="green"
              onClick={() => setQuantity((quantity) => {
                const newQuantity = [...quantity];
                newQuantity[index] = parseInt(inputQuantity[index]) || 0;
                setInputQuantity((inputQuantity) => {
                    const newInputQuantity = [...inputQuantity];
                    newInputQuantity[index] = '';
                    return newInputQuantity;
                    });
                return newQuantity;
              })}
            >
              Set
            </Button>
          </HStack>
        </ButtonGroup>
      </Td>
    </Tr>
  );
};

export default RowContent;
