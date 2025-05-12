import { VStack, HStack, Box, Icon, Text, Heading } from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaBuilding, FaDoorOpen } from "react-icons/fa";
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

const RackManagement = ({authorized, setAuthorized }) => {
  console.log(authorized);
  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
      <Heading as="h1" size="xl" mb={6} textAlign="center">Rack Management</Heading>
      <VStack spacing={4} align="stretch">
        <RackItem 
          icon={FaBuilding} 
          title="Add Hotel" 
          description="Create a new hotel"
          color="blue"
        >
          <AddHotelForm />
        </RackItem>
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
