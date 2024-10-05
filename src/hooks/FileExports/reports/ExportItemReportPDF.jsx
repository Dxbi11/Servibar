import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ExportItemReportPDF = ({ invoices, StartDate, EndDate, forPrint }) => {

  const handleExport = () => {
    const doc = new jsPDF();

    // Add a title at the top of the PDF
    doc.setFontSize(18); // Set font size
    doc.text("Item Report", 14, 20); // Add title text at coordinates (x: 14, y: 20)
    doc.setFontSize(12); // Reset font size for other content

    // Optionally, add a subtitle or date range
    doc.text(`Report Date Range: ${format(StartDate, "yyyy-MM-dd")} - ${format(EndDate, "yyyy-MM-dd")}`, 14, 30);

    // Define table columns and rows
    const tableColumn = ["Date", "Product", "Price", "Quantity"];
    const tableRows = [];

    invoices.forEach((invoice) => {
      invoice.items.forEach((item) => {
        const InvoiceData = [
          format(new Date(invoice.date), "yyyy-MM-dd"), // Format date
          item.name,    // Product name
          `$${item.price}`,  // Product price
          item.quantity     // Product quantity
        ];
        tableRows.push(InvoiceData);
      });
    });

    // Generate the table below the title
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Start the table below the text (adjusted to avoid overlap)
    });

    // Save or print the PDF
    if (forPrint) {
      doc.autoPrint(); // Open print dialog
      doc.output('dataurlnewwindow'); // Open in a new window for print preview
    } else {
      doc.save(`Item Report (${format(StartDate, "yyyy-MM-dd")} - ${format(EndDate, "yyyy-MM-dd")}).pdf`); // Save as PDF
    }
  };

  return (
    <Button mr={2} colorScheme={forPrint ? 'red' : 'blue'} onClick={handleExport} ml={4}>
      {forPrint ? "Print PDF" : "Download PDF"}
    </Button>
  );
};

export default ExportItemReportPDF;
