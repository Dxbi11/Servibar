import React, { useState } from "react";
import {
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
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
    <>
      <Tabs
        variant="soft-rounded"
        onChange={(index) => setTabIndex(index)}
        bg={bg}
      >
        <TabList>
          <Tab>Red</Tab>
          <Tab>manage room products</Tab>
          <Tab>manage hotel products</Tab>
        </TabList>
        <TabPanels p="2rem">
          <TabPanel>a</TabPanel>
          <TabPanel>Are 1, 2, 3</TabPanel>
          <TabPanel>
            <div>
              <Text fontSize="3xl">Add product</Text>
              <AddProduct hotelId={hotelId} />
              <Text fontSize="3xl">Delete product</Text>
              <DeleteProduct hotelId={hotelId} />
              <Text fontSize="3xl">Product list</Text>
              <ProductList hotelId={hotelId} />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default MainInventory;
