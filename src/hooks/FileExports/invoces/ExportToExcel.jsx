import React from "react";
import { Button } from "@chakra-ui/react";
import * as XLSX from "xlsx";
import { format } from 'date-fns';

const ExportToExcel = ({ invoices, showInUSD, exchangeRate }) => {
  const CurrentDay = new Date();
  const handleExport = () => {
    const data = invoices.map((invoice) => ({
      Date: new Date(invoice.date).toLocaleDateString(),
      Total: showInUSD
        ? `₡${(invoice.total * exchangeRate).toFixed(2)}`
        : `$${invoice.total.toFixed(2)}`,
      Comment: invoice.comment,
      Room: invoice.room,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");

    XLSX.writeFile(wb, `Invoices ${format(CurrentDay, 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <Button colorScheme="green" onClick={handleExport}>
      Download Excel
    </Button>
  );
};

export default ExportToExcel;
