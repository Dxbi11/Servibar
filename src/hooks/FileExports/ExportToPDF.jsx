import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ExportToPDF = ({ invoices, showInUSD, exchangeRate }) => {
  const handleExport = () => {
    const doc = new jsPDF();

    const tableColumn = ["ID", "Total", "Date", "Comment", "Room"];
    const tableRows = [];

    invoices.forEach((invoice) => {
      const invoiceData = [
        invoice.id,
        showInUSD
          ? `₡${(invoice.total * exchangeRate).toFixed(2)}`
          : `$${invoice.total.toFixed(2)}`,
        new Date(invoice.date).toLocaleDateString(),
        invoice.comment,
        invoice.room,
      ];
      tableRows.push(invoiceData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("Invoices.pdf");
  };

  return (
    <Button colorScheme="red" onClick={handleExport}>
      Download PDF
    </Button>
  );
};

export default ExportToPDF;
