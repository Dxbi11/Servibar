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
} from "@chakra-ui/react";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import DeleteProduct from "./DeleteProduct";

const MainInventory = ({ hotelId }) => {
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
          <Tab>Red</Tab>
          <Tab>Manage Room Products</Tab>
          <Tab>Manage Hotel Products</Tab>
        </TabList>
        <TabPanels p="1rem">
          <TabPanel>
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Red Tab Content
              </Heading>
              <Text>Content for the Red tab goes here.</Text>
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
                <AddProduct hotelId={hotelId} />
              </Box>
              <Box mb={4}>
                <Text fontSize="xl">Delete Product</Text>
                <DeleteProduct hotelId={hotelId} />
              </Box>
              <Box>
                <Text fontSize="xl">Product List</Text>
                <ProductList hotelId={hotelId} />
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MainInventory;
