import React, { useState, useEffect } from "react";
import { getRoomsByHotelId, getRoomStock } from "../api";
import {
  Button,
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
  Select,
  useDisclosure,
  VStack,
  Text,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
} from "@chakra-ui/react";

const InventoryTable = ({ selectedRoom, hotelId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inventory, setInventory] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toast = useToast();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getRoomsByHotelId(hotelId);
        setRooms(roomsData);
      } catch (err) {
        setError("Failed to fetch rooms");
        toast({
          title: "Error",
          description: "Failed to fetch rooms",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchRooms();
  }, [hotelId, toast, isOpen]);

  useEffect(() => {
    const fetchInventory = async () => {
      if (selectedRoom) {
        try {
          setLoading(true);
          const inventoryData = await getRoomStock(selectedRoom.id);
          setInventory(inventoryData);
        } catch (err) {
          setError("Failed to fetch inventory");
          toast({
            title: "Error",
            description: "Failed to fetch inventory",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInventory();
  }, [selectedRoom, toast]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>
        Inventory for Room {selectedRoom?.roomNumber}
      </Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Product</Th>
            <Th>Quantity</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {inventory.map((item) => (
            <Tr key={item.id}>
              <Td>{item.product.name}</Td>
              <Td>{item.quantity}</Td>
              <Td>
                <Button size="sm" onClick={onOpen}>
                  Edit
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Inventory Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add form fields for editing inventory item */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default InventoryTable;
