import React, { useState } from "react";
import {
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Box,
  Heading,
  VStack 
} from "@chakra-ui/react";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import DeleteProduct from "./DeleteProduct";
// Components for Room Stock
import TableStock from "./StockByRoom/TableStock";
import HeaderStock from "./StockByRoom/HeaderStock";

const MainInventory = () => {
  const colors = useColorModeValue(
    ["red.50", "teal.50", "blue.50"],
    ["red.900", "teal.900", "blue.900"]
  );

  const [tabIndex, setTabIndex] = useState(0);
  const bg = colors[tabIndex];

  return (
    <Box p={4} bg={bg} borderRadius="md" boxShadow="sm">
      <Tabs variant="soft-rounded" onChange={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>Manage Stock By Room</Tab>
          <Tab>Manage Room Products</Tab>
          <Tab>Manage Hotel Products</Tab>
        </TabList>
        <TabPanels p="1rem">
          <TabPanel>
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Search room
              </Heading>
              <VStack spacing={8} align="stretch">
                
              </VStack>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Manage Room Products
              </Heading>
              <Text>Content for managing room products.</Text>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Manage Hotel Products
              </Heading>
              <Box mb={4}>
                <Text fontSize="xl">Add Product</Text>
                <AddProduct  />
              </Box>
              <Box mb={4}>
                <Text fontSize="xl">Delete Product</Text>
                <DeleteProduct />
              </Box>
              <Box>
                <Text fontSize="xl">Product List</Text>
                <ProductList />
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MainInventory;
