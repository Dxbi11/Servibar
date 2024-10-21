import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ExportItemReportPDF = ({ invoices, StartDate, EndDate, forPrint, Items }) => {

  const handleExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width; // Get the width of the page
    const TotalItemsCost = Items.reduce((acc, item) => acc + item.total, 0);
    
    // Set a different font if you have a custom one (e.g., Helvetica)
    doc.setFont("Helvetica", "normal");

    // Add a title at the top of the PDF
    doc.setFontSize(18); // Set font size
    doc.text("Item Report", pageWidth / 2, 20, { align: 'center' }); // Add title text at coordinates (x: 14, y: 20)
    doc.setFontSize(12); // Reset font size for other content

    // Add the date range of the report
    doc.text(`Report Date Range: ${format(new Date(StartDate), "yyyy-MM-dd")} - ${format(new Date(EndDate), "yyyy-MM-dd")}`, pageWidth / 2, 30, { align: 'center' });

    // Display totals from Items as a table at the top
    doc.setFontSize(14);

    // Center "Items Summary" text
    doc.setFontSize(14); // Set font size
    doc.text("Items Summary", pageWidth / 2, 40, { align: 'center' }); // Centered at y: 40
    
    // Center "Total Sales" text
    doc.text(`Total Sales $${TotalItemsCost}`, 14, 50); // Centered at y: 50
    

    // Define the item totals table columns and rows
    const itemSummaryColumns = ["Product Name", "Total Quantity", "Total Sales"];
    const itemSummaryRows = Items.map((item) => [item.name, item.quantity, `$${item.total.toFixed(2)}`]);
    // Generate the item totals table
    doc.autoTable({
      head: [itemSummaryColumns],
      body: itemSummaryRows,
      startY: 60, // Start the table just below the "Total Items Summary"
    });

    // Reset font size before adding the invoices table
    doc.setFontSize(12);

    // Define table columns and rows for invoice details
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

    // Generate the invoice details table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: doc.lastAutoTable.finalY + 10, // Start the table after the item totals table
    });

    // Save or print the PDF
    if (forPrint) {
      doc.autoPrint(); // Open print dialog
      doc.output('dataurlnewwindow'); // Open in a new window for print preview
    } else {
      doc.save(`Item Report (${format(new Date(StartDate), "yyyy-MM-dd")} - ${format(new Date(EndDate), "yyyy-MM-dd")}).pdf`); // Save as PDF
    }
  };

  return (
    <Button mr={2} colorScheme={forPrint ? 'red' : 'blue'} onClick={handleExport} ml={4}>
      {forPrint ? "Print PDF" : "Download PDF"}
    </Button>
  );
};

export default ExportItemReportPDF;
