import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ExportSalesReportPDF = ({ invoices, StartDate, EndDate, forPrint, substractTax }) => {

  const handleExport = () => {
    console.log(substractTax);
    const doc = new jsPDF();

    // Add a title at the top of the PDF
    doc.setFontSize(18); // Set font size
    doc.text("Sales Report", 14, 20); // Add title text at coordinates (x: 14, y: 20)
    doc.setFontSize(12); // Reset font size for other content

    // Optionally, add a subtitle or date range
    doc.text(`Sales Date Range: ${format(StartDate, "yyyy-MM-dd")} - ${format(EndDate, "yyyy-MM-dd")}`, 14, 30);

    // Define table columns and rows
    const tableColumn = ["Date", "Room", "Total"];
    const tableRows = [];

    invoices.forEach((invoice) => {
        const InvoiceData = [
          format(new Date(invoice.date), "yyyy-MM-dd"), // Format date
          invoice.room,    // Invoice room
          `$${invoice.total.toFixed(2)}`,  // Invoice total with 2 decimal places
        ];
        tableRows.push(InvoiceData);
    });

    const calculateTotal = (invoicesList) => {
        return invoicesList.reduce((acc, invoice) => {
          const total = invoice.total || 0; // Ensure total is at least 0
          const adjustedTotal = substractTax > 0 
            ? total * (1 - substractTax / 100) // Apply tax reduction if valid
            : total; // Otherwise, use the original total
          return acc + adjustedTotal;
        }, 0); // Initial value of accumulator set to 0
      };
      

    const totalSales = calculateTotal(invoices).toFixed(2); // Format total sales to 2 decimal places

    // Generate the table below the title
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Start the table below the text (adjusted to avoid overlap)
    });

    // Add the total sales at the bottom of the table
    const finalY = doc.lastAutoTable.finalY + 10; // Get Y position after the table ends and add some padding
    doc.text(`Total Sales: $${totalSales}`, 14, finalY); // Add total sales text below the table

    // Save or print the PDF
    if (forPrint) {
      doc.autoPrint(); // Open print dialog
      doc.output('dataurlnewwindow'); // Open in a new window for print preview
    } else {
      doc.save(`Sales Report (${format(StartDate, "yyyy-MM-dd")} - ${format(EndDate, "yyyy-MM-dd")}).pdf`); // Save as PDF
    }
  };

  return (
    <Button mr={2} colorScheme={forPrint ? 'red' : 'blue'} onClick={handleExport} ml={4}>
      {forPrint ? "Print PDF" : "Download PDF"}
    </Button>
  );
};

export default ExportSalesReportPDF;
