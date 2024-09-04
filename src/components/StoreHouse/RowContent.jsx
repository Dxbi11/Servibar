import React, { useContext, useState, useCallback, useRef } from "react";
import { store } from "../../../store";
import { Td, Tr, Button, ButtonGroup, Input, HStack, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";
import useUpdateStoreHouseData from "../../hooks/StoreHooks/useUpdateStoreHouse";

const RowContent = ({ product, index, quantity, storeHouseId }) => {
  const { state } = useContext(store);
  const hotelId = state.ui.hotelId;
  const updateStoreHouseData = useUpdateStoreHouseData();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // Track whether the action is increment or decrement
  const cancelRef = useRef();
  const toast = useToast();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const openModal = useCallback((type) => {
    setActionType(type);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    const inputNumber = parseInt(inputValue, 10);
    let newQuantity = quantity;

    if (actionType === "increment") {
      newQuantity = !isNaN(inputNumber) ? quantity + inputNumber : quantity + 1;
    } else if (actionType === "decrement") {
      newQuantity = !isNaN(inputNumber) ? quantity - inputNumber : quantity - 1;
    }

    updateStoreHouseData(storeHouseId, { quantity: newQuantity });

    setInputValue(""); // Clear the input after updating
    setIsOpen(false); // Close the confirmation modal

    // Show success toast
    toast({
      title: "Quantity updated.",
      description: `The quantity of ${product?.name || "the product"} has been ${actionType}ed.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [inputValue, quantity, updateStoreHouseData, storeHouseId, toast, actionType, product?.name]);

  return (
    <>
      {storeHouseId && (
        <>
          <Tr>
            <Td>{product?.name || "Unknown Product"}</Td>
            <Td>{quantity}</Td>
            <Td>
              <HStack spacing={2}>
                <Input
                  type="number"
                  value={inputValue}
                  onChange={handleInputChange}
                  min="0"
                  bg="white"
                />
                <ButtonGroup size="sm" isAttached>
                  <Button colorScheme="teal" onClick={() => openModal("increment")}>
                    +
                  </Button>
                  <Button colorScheme="red" onClick={() => openModal("decrement")}>
                    -
                  </Button>
                </ButtonGroup>
              </HStack>
            </Td>
          </Tr>

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={() => setIsOpen(false)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Confirm Action
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure you want to {actionType} the quantity for {product?.name || "the product"}?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button colorScheme="teal" onClick={handleConfirm} ml={3}>
                    Confirm
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      )}
    </>
  );
};

export default RowContent;
