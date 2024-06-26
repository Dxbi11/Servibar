import React, { useState, useEffect } from "react";
import AddInvoice from "./AddInvoice";
import ProductSelector from "./ProductSelector";
import ShowInvoicesByHotel from "./ShowInvoicesByHotel";
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

const MainInvoiceMenu = ({ hotelId }) => {
  const colors = useColorModeValue(
    ["teal.50", "teal.50", "blue.50"],
    ["teal.900", "teal.900", "blue.900"]
  );

  const [tabIndex, setTabIndex] = useState(0);
  const bg = colors[tabIndex];

  return (
    <Box p={4} bg={bg} borderRadius="md" boxShadow="sm">
      <Tabs variant="soft-rounded" onChange={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>New Invoice</Tab>
          <Tab>Invoice History</Tab>
          <Tab>Statistics</Tab>
        </TabList>
        <TabPanels p="1rem">
          <TabPanel>
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Generate invoice
                <ProductSelector hotelId={hotelId} />
                <AddInvoice hotelId={hotelId} />
              </Heading>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Invoices
                <ShowInvoicesByHotel hotelId={hotelId} />
              </Heading>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <Heading as="h2" size="md" mb={4}>
                Statistics
              </Heading>
              <Box mb={4}>
                <Text fontSize="xl">Add Product</Text>
              </Box>
              <Box mb={4}>
                <Text fontSize="xl">Delete Product</Text>
              </Box>
              <Box>
                <Text fontSize="xl">Product List</Text>
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MainInvoiceMenu;
