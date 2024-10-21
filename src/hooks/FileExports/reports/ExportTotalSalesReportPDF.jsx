import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ExportTotalSalesReportPDF = ({ invoices, StartDate, EndDate, forPrint, substractTax, Sales }) => {
  console.log(Sales);
  const handleExport = () => {
    const calculateTotal = (invoicesList) => {
        return invoicesList.reduce((acc, invoice) => {
          const total = invoice.total || 0; // Ensure total is at least 0
          const adjustedTotal = substractTax > 0 
            ? total * (1 - substractTax / 100) // Apply tax reduction if valid
            : total; // Otherwise, use the original total
          return acc + adjustedTotal;
        }, 0); // Initial value of accumulator set to 0
      };
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width; // Get the width of the page
    const totalSales = calculateTotal(invoices).toFixed(2); // Format total sales to 2 decimal places

    // Add a title at the top of the PDF
    doc.setFontSize(18); // Set font size
    doc.text("Total Sales Report", pageWidth / 2, 20, { align: 'center' }); // Add title text at coordinates (x: 14, y: 20)
    doc.setFontSize(12); // Reset font size for other content

    // Optionally, add a subtitle or date range
    doc.text(`Sales Date Range: ${format(StartDate, "yyyy-MM-dd")} - ${format(EndDate, "yyyy-MM-dd")}`, pageWidth / 2, 30, { align: 'center' });

    // Center "Items Summary" text
    doc.setFontSize(14); // Set font size
    doc.text("Total Sales Summary", pageWidth / 2, 40, { align: 'center' }); // Centered at y: 40
    doc.text(`Total Sales: $${totalSales}`, 14, 50); // Add total sales text below the table
    
    // Define the item totals table columns and rows
    const TotalSalesSummaryColumns = ["Date", "Total"];
    const TotalSalesSummaryRows = Sales.map((sale) => [sale.date,`$${sale.total.toFixed(2)}`]);
    // Generate the item totals table
    doc.autoTable({
      head: [TotalSalesSummaryColumns],
      body: TotalSalesSummaryRows,
      startY: 60, // Start the table just below the "Total Items Summary"
    });

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
      


    // Generate the table below the title
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: doc.lastAutoTable.finalY + 10, // Start the table below the text (adjusted to avoid overlap)
    });

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

export default ExportTotalSalesReportPDF;
