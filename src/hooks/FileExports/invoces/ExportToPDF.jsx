import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from 'date-fns';

const ExportToPDF = ({ invoices, showInUSD, exchangeRate, forPrint }) => {
  const CurrentDay = new Date();

  const generatePDF = () => {
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

    if (forPrint) {
      doc.autoPrint(); // Automatically open the print dialog
      doc.output('dataurlnewwindow'); // Open in a new window for print preview
    } else {
      doc.save(`Invoices ${format(CurrentDay, 'yyyy-MM-dd')}.pdf`); // Save as PDF
    }
  };

  return (
    <>
      <Button colorScheme={forPrint ? 'red': 'blue'} onClick={generatePDF}>
        {forPrint ? "Print PDF" : "Download PDF"}
      </Button>
    </>
  );
};

export default ExportToPDF;
