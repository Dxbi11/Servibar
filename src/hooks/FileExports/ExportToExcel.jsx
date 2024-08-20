import React from "react";
import { Button } from "@chakra-ui/react";
import * as XLSX from "xlsx";

const ExportToExcel = ({ invoices, showInUSD, exchangeRate }) => {
  const handleExport = () => {
    const data = invoices.map((invoice) => ({
      ID: invoice.id,
      Total: showInUSD
        ? `₡${(invoice.total * exchangeRate).toFixed(2)}`
        : `$${invoice.total.toFixed(2)}`,
      Date: new Date(invoice.date).toLocaleDateString(),
      Comment: invoice.comment,
      Room: invoice.room,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");

    XLSX.writeFile(wb, "Invoices.xlsx");
  };

  return (
    <Button colorScheme="blue" onClick={handleExport}>
      Download Excel
    </Button>
  );
};

export default ExportToExcel;
