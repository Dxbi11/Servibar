import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ExportTotalSalesReportPDF = ({ invoices, StartDate, EndDate, forPrint, substractTax, Sales }) => {

  const handleExport = () => {
    const calculateTotal = (invoicesList) => {
      return invoicesList.reduce((acc, invoice) => {
        const total = invoice.total || 0;
        const adjustedTotal = substractTax > 0 
          ? total * (1 - substractTax / 100)
          : total;
        return acc + adjustedTotal;
      }, 0);
    };

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const totalSales = calculateTotal(invoices).toFixed(2);

    // Header with title and date range
    doc.setFontSize(20);
    doc.text("Sales Report", pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Report Date Range: ${StartDate} to ${EndDate}`, pageWidth / 2, 28, { align: 'center' });

    // Section for Summary of Total Sales
    doc.setFontSize(12);
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 35, pageWidth - 10, 35);

    doc.text("Summary of Sales", 14, 45);
    doc.setFontSize(10);
    doc.text(`Overall Total Sales Amount: $${totalSales}`, 14, 50);

    if (substractTax > 0) {
      doc.text(`(After ${substractTax}% Tax Deduction)`, 14, 55);
    }

    // Title for "Daily Sales Summary" Table
    doc.setFontSize(12);
    doc.text("Sales Summary", 14, 70);
    
    // "Daily Sales Summary" Table
    const totalSalesSummaryColumns = ["Date (YYYY-MM-DD)", "Total"];
    const totalSalesSummaryRows = Sales.map((sale) => [
      sale.date, 
      `$${sale.total.toFixed(2)}`
    ]);

    doc.autoTable({
      head: [totalSalesSummaryColumns],
      body: totalSalesSummaryRows,
      startY: 75,
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: 255 }, // Dark blue header
      styles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [173, 216, 230] }, // Light blue rows
    });

    // Title for "Invoice Details" Table
    doc.setFontSize(12);
    doc.text("Invoice Details", 14, doc.lastAutoTable.finalY + 20);

    // Create a color map to assign colors to each date
    const colorMap = {};
    let colorIndex = 0;
    const colors = [[173, 216, 230], [224, 255, 255]]; // Light blue and light cyan

    invoices.forEach(invoice => {
      const date = format(new Date(invoice.date), "yyyy-MM-dd");
      if (!colorMap[date]) {
        colorMap[date] = colors[colorIndex % colors.length];
        colorIndex++;
      }
    });

    // Detailed "Invoice Details" Table with color based on date
    const tableColumn = ["Invoice Date", "Room Number", "Total Amount"];
    const tableRows = invoices.map(invoice => [
      format(new Date(invoice.date), "yyyy-MM-dd"),
      invoice.room,
      `$${invoice.total.toFixed(2)}`
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: doc.lastAutoTable.finalY + 25,
      theme: 'striped',
      headStyles: { fillColor: [0, 51, 102], textColor: 255 }, // Dark blue header
      styles: { fontSize: 10, cellPadding: 4 },
      willDrawCell: (data) => {
        if (data.section === 'body') {
          const date = data.row.raw[0]; // The date in the row data
          const color = colorMap[date];
          if (color) {
            doc.setFillColor(...color); // Apply color based on date
          }
        }
      }
    });

    // Footer with Grand Total Summary
    doc.setFontSize(12);
    doc.setDrawColor(200, 200, 200);
    doc.line(10, doc.lastAutoTable.finalY + 10, pageWidth - 10, doc.lastAutoTable.finalY + 10);
    doc.text(`Overall Total Sales Amount: $${totalSales}`, 14, doc.lastAutoTable.finalY + 20);

    if (forPrint) {
      doc.autoPrint();
      doc.output('dataurlnewwindow');
    } else {
      doc.save(`Sales Report (${StartDate} to ${EndDate}).pdf`);
    }
  };

  return (
    <Button mr={2} colorScheme={forPrint ? 'red' : 'blue'} onClick={handleExport} ml={4}>
      {forPrint ? "Print PDF" : "Download PDF"}
    </Button>
  );
};

export default ExportTotalSalesReportPDF;
