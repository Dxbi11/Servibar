import React, { useState, useEffect } from "react";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import { getAllHotels } from "../api"; // Adjust the import path as necessary
import { Select } from "@chakra-ui/react";

const MainInventory = ({ hotelId }) => {
  return (
    <div>
      <h1>Hotel Inventory Management</h1>

      <AddProduct hotelId={hotelId} />
      <ProductList hotelId={hotelId} />
    </div>
  );
};

export default MainInventory;
