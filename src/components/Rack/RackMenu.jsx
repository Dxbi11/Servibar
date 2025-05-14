import { VStack, HStack, Box, Icon, Text, Heading, Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { AddIcon, DeleteIcon, LockIcon } from "@chakra-ui/icons";
import { FaBuilding, FaDoorOpen } from "react-icons/fa";
import { useState } from "react";
import AddHotelForm from './AddHotel';
import AddFloors from './AddFloor';
import DeleteModal from './Delete';
import AddRoom from "./AddRoom";

const RackItem = ({ icon, title, description, children, color }) => (
  <Box p={4} borderWidth={1} borderRadius="md" _hover={{ bg: `${color}.50` }}>
    <HStack spacing={4} align="start">
      <Icon as={icon} color={`${color}.500`} boxSize={6} mt={1} />
      <VStack align="start" spacing={1} flex={1}>
        <Text fontWeight="bold">{title}</Text>
        <Text fontSize="sm" color="gray.600">{description}</Text>
        {children}
      </VStack>
    </HStack>
  </Box>
);

const RackManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  // Check password - hardcoded password "1984tonkai"
  const validatePassword = () => {
    if (password === "1984tonkai") {
      setAuthorized(true);
      setPasswordError(false);
      onClose();
    } else {
      setPasswordError(true);
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md">      <HStack justifyContent="space-between" mb={6}>
        <Heading as="h1" size="xl">Rack Management</Heading>
        {authorized && (
          <Button 
            size="sm" 
            colorScheme="gray" 
            onClick={() => setAuthorized(false)}
            leftIcon={<LockIcon />}
          >
            Lock
          </Button>
        )}
      </HStack>
      
      {!authorized && (
        <Box textAlign="center" mb={4}>
          <Button 
            leftIcon={<LockIcon />} 
            colorScheme="teal" 
            onClick={onOpen}
            mb={4}
          >
            Unlock Advanced Features
          </Button>
          <Text fontSize="sm" color="gray.500">
            Some features require authentication
          </Text>
        </Box>
      )}

      {/* Authentication Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Authentication Required</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Please enter the password to access advanced features:</Text>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={passwordError}
            />
            {passwordError && (
              <Text color="red.500" fontSize="sm" mt={2}>
                Incorrect password. Please try again.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={validatePassword}>
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <VStack spacing={4} align="stretch">
        {authorized === true ? <RackItem 
          icon={FaBuilding} 
          title="Add Hotel" 
          description="Create a new hotel"
          color="blue"
        >
          <AddHotelForm />
        </RackItem> : null}
        {authorized === true ? <RackItem 
          icon={AddIcon} 
          title="Add Floors" 
          description="Add floors to a hotel"
          color="green"
        >
          <AddFloors />
        </RackItem> : null}
        {authorized === true ? <RackItem 
          icon={FaDoorOpen} 
          title="Add Room" 
          description="Create a new room"
          color="purple"
        >
          <AddRoom />
        </RackItem> : null}
        {authorized === true ? <RackItem 
          icon={DeleteIcon} 
          title="Delete" 
          description="Remove items"
          color="red"
        >
          <DeleteModal authorized= {authorized} setAuthorized={setAuthorized}/>
        </RackItem> : null}
      </VStack>
    </Box>
  );
};

export default RackManagement;
