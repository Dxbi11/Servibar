import React from 'react';
import { Button, Box } from "@chakra-ui/react";
import * as XLSX from "xlsx";
import { format } from 'date-fns';

const ExportTableStoreHouseToExcel = ({ products, storeHouse }) => {
    const CurrentDay = new Date();
  const sortedStoreHouse = [...storeHouse].sort((a, b) => a.productId - b.productId);
  const sortedProducts = [...products].sort((a, b) => a.id - b.id);
  // Generate the Excel file
  const generateExcel = () => {
    if (sortedStoreHouse.length === 0 || sortedProducts.length === 0) {
      alert("Data is not available. Please try again.");
      return;
    }

    const columns = [
      "Product Name",
      "Quantity",
    ];

    // Create rows for the Excel file
    const rows = sortedStoreHouse.map((row) => ({
      "Product Name": sortedProducts.find(product => product.id === row.productId)?.name || "Unknown Product",
      Quantity: row.quantity,
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: columns });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `StoreHouse ${format(CurrentDay, 'yyyy-MM-dd')}.xlsx`);

    // Save the Excel file
    XLSX.writeFile(workbook, `StoreHouse ${format(CurrentDay, 'yyyy-MM-dd')}.xlsx`);
  };

  return (
      <Button colorScheme="green" onClick={generateExcel}>
        Export StoreHouse to Excel
      </Button>
  );
};

export default ExportTableStoreHouseToExcel;
