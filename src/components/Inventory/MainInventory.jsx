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
  VStack,
  Flex
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
        <TabList justifyContent="center" gap={4}>
          <Tab>Manage Stock By Room</Tab>
        </TabList>
        <TabPanels p="1rem">
          <TabPanel>
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Manage Hotel Products
              </Heading>
              <Flex direction="row" justify="space-between" mb={4}>
                <Box flex="1" mr={4}>
                  <Text fontSize="xl">Add Product</Text>
                  <AddProduct />
                </Box>
                <Box flex="1">
                  <Text fontSize="xl">Delete Product</Text>
                  <DeleteProduct />
                </Box>
              </Flex>
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
