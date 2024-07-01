import React, { useState } from "react";
import {
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import RackMenu from "./RackMenu"; // Import RackMenu component

const AdminModeSwitch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const correctPin = "1234"; // Replace with your actual correct pin

  const handleToggle = () => {
    if (isAdmin) {
      setIsAdmin(false); // Deactivate admin mode if switch is already active
    } else {
      setIsOpen(true); // Open modal to enter pin
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setPin("");
  };

  const handleSubmit = () => {
    if (pin === correctPin) {
      setIsAdmin(true);
      setIsOpen(false);
    } else {
      alert("Incorrect pin. Please try again.");
      setPin("");
    }
  };

  return (
    <>
      <Switch isChecked={isAdmin} onChange={handleToggle} />
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter PIN</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Pin</FormLabel>
              <Input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Submit
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {isAdmin && (
        <div>
          <Text mt={2} color="green.500">
            Admin mode activated
          </Text>
          <RackMenu />
        </div>
      )}
    </>
  );
};

export default AdminModeSwitch;
