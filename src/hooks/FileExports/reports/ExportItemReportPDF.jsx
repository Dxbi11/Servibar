import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ExportItemReportPDF = ({ invoices, StartDate, EndDate, forPrint, Items }) => {

  const handleExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const TotalItemsCost = Items.reduce((acc, item) => acc + item.total, 0);

    doc.setFont("Helvetica", "normal");

    // Title and Date Range
    doc.setFontSize(18);
    doc.text("Item Report", pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Report Date Range: ${StartDate} - ${EndDate}`, pageWidth / 2, 30, { align: 'center' });

    // Divider Line
    doc.setLineWidth(0.5);
    doc.line(10, 35, pageWidth - 10, 35);

    // Item Summary Section
    doc.setFontSize(14);
    doc.text("Items Summary", pageWidth / 2, 45, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Total Sales: $${TotalItemsCost.toFixed(2)}`, 14, 55);

    // Table: Item Summary
    const itemSummaryColumns = ["Product Name", "Total Quantity", "Total Sales"];
    const itemSummaryRows = Items.map((item) => [item.name, item.quantity, `$${item.total.toFixed(2)}`]);

    doc.autoTable({
      head: [itemSummaryColumns],
      body: itemSummaryRows,
      startY: 60,
      theme: 'striped', 
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'center' },
        2: { halign: 'right' },
      },
    });

    // Divider Line
    doc.setLineWidth(0.5);
    doc.line(10, doc.lastAutoTable.finalY + 5, pageWidth - 10, doc.lastAutoTable.finalY + 5);

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

    // Invoice Details Section
    doc.setFontSize(14);
    doc.text("Invoice Details", pageWidth / 2, doc.lastAutoTable.finalY + 15, { align: 'center' });

    // Table: Invoice Details
    const tableColumn = ["Date", "Product", "Price", "Quantity"];
    const tableRows = [];

    invoices.forEach((invoice) => {
      invoice.items.forEach((item) => {
        const InvoiceData = [
          format(new Date(invoice.date), "yyyy-MM-dd"),
          item.name,
          `$${item.price.toFixed(2)}`,
          item.quantity,
        ];
        tableRows.push(InvoiceData);
      });
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: doc.lastAutoTable.finalY + 20,
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'center' },
      },
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

    // Save or Print PDF
    if (forPrint) {
      doc.autoPrint();
      doc.output('dataurlnewwindow');
    } else {
      doc.save(`Item Report (${StartDate} - ${EndDate}).pdf`);
    }
  };

  return (
    <Button mr={2} colorScheme={forPrint ? 'red' : 'blue'} onClick={handleExport} ml={4}>
      {forPrint ? "Print PDF" : "Download PDF"}
    </Button>
  );
};

export default ExportItemReportPDF;
