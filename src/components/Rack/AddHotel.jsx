import React, { useState } from "react";
import { createHotel } from "../../api";
import { Input, Text, Button, Toast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const AddHotelForm = () => {
  const [name, setName] = useState("");

  const [isOpen, setIsOpen] = useState(false); // State to control modal visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHotel({ name });
      Toast({
        title: "Rooms added.",
        description: `Hotel ${name} added successfully!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setName("");
    } catch (error) {
      console.error("Error adding hotel:", error);
    }
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
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Button colorScheme="teal" type="submit">
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
