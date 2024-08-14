import React, { useState, useContext } from "react";
import { store } from "../../../store";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import useCreateInvoice from "../../hooks/InvoiceHooks/useCreateInvoice";

const AddInvoice = () => {
  const { state } = useContext(store);
  const hotelId = state.ui.hotelId;
  const [total, setTotal] = useState("");
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const [room, setRoom] = useState("");
  const { handleSubmit, loading, error } = useCreateInvoice();
  const toast = useToast();

  const handleCommentChange = (newComment) => {
    setComment(newComment);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const invoiceData = {
      total: parseFloat(total),
      date: date ? new Date(date) : undefined,
      hotelId: parseInt(hotelId),
      comment,
      room: parseInt(room),
    };
    handleSubmit(invoiceData);
    // Reset form fields
    setTotal("");
    setDate("");
    setComment("");
    setRoom("");
  };

  return (
    <Box p={4} maxWidth="500px" mx="auto">
      <form onSubmit={onSubmit}>
        <VStack spacing={4}>
          <FormControl id="total" isRequired>
            <FormLabel>Total</FormLabel>
            <NumberInput
              value={total}
              onChange={(valueString) => setTotal(valueString)}
              precision={2}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl id="date">
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>

          <FormControl id="comment">
            <FormLabel>Comment</FormLabel>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              onClick={() => handleCommentChange("in-House")}
              variant="outline"
              colorScheme={comment === "in-House" ? "blue" : "gray"}
            >
              in-House
            </Button>
            <Button
              onClick={() => handleCommentChange("Reported")}
              variant="outline"
              colorScheme={comment === "Reported" ? "blue" : "gray"}
            >
              Reported
            </Button>
          </FormControl>

          <FormControl id="room">
            <FormLabel>Room</FormLabel>
            <NumberInput
              value={room}
              onChange={(valueString) => setRoom(valueString)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
            Add Invoice
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddInvoice;
