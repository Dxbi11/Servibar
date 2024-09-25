import React from "react";
import { Button } from "@chakra-ui/react";
import * as XLSX from "xlsx";
import { format } from "date-fns";

const ExportProductsToExcel = ({ products }) => {
  const CurrentDay = new Date();

  const handleExport = () => {
    const data = products.map((product) => ({
      ID: product.id,
      Name: product.name,
      Price: `${product.price.toFixed(2)}`,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    XLSX.writeFile(wb, `Products ${format(CurrentDay, "yyyy-MM-dd")}.xlsx`);
  };

  return (
    <Button colorScheme="green" onClick={handleExport}>
      Download Excel
    </Button>
  );
};

export default ExportProductsToExcel;
