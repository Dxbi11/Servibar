import React, { useState } from "react";
import { Input, Text, Button } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import useCreateHotel from "../../hooks/HotelHooks/useCreateHotel";

const AddHotelForm = () => {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State to control modal visibility
  const { handleSubmit, loading } = useCreateHotel(); // Destructure handleSubmit and loading from the custom hook

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ name });
    setName("");
    handleModalClose(); // Close the modal after successful addition
  };

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Button onClick={handleModalOpen} colorScheme="blue" mt={4}>
        Add Hotel
      </Button>

      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="3xl">Add Hotel</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSubmit}>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Button colorScheme="teal" type="submit" isLoading={loading}>
                Add Hotel
              </Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddHotelForm;
