import React, { useState } from 'react';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Input, Select, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';

const AddProductToHotelModal = ({ hotelId, onCreateProduct }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [errors, setErrors] = useState([]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]); // Clear any previous errors

    try {
      const productData = { name, price, hotelId };
      await onCreateProduct(productData);
      handleClose();
      setName('');
      setPrice(0);
    } catch (error) {
      console.error('Error creating product:', error);
      setErrors(error.response?.data || ['Failed to create product']);
    }
  };

  return (
    <>
      <Button onClick={handleOpen}>Add Product</Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product to Hotel</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={errors.length > 0}>
              <FormLabel htmlFor="name">Product Name</FormLabel>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              <FormErrorMessage>{errors.find((error) => error.includes('name'))}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.length > 0}>
              <FormLabel htmlFor="price">Price</FormLabel>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              <FormErrorMessage>{errors.find((error) => error.includes('price'))}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Add Product
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddProductToHotelModal;
