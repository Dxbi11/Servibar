import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ExportItemReportPDF = ({ invoices, StartDate, EndDate, forPrint }) => {

  const handleExport = () => {
    const doc = new jsPDF();

    const tableColumn = ["Date", "Product", "Price", "Quantity"];
    const tableRows = [];
    console.log(invoices);
    invoices.forEach((invoice) => {
      const InvoiceData = [
        invoice.date,
        invoice.items.name,
        `$${invoice.items.price}`,
        `$${invoice.items.quantity}`
      ];
      tableRows.push(InvoiceData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    if (forPrint) {
      doc.autoPrint(); // Abrir cuadro de diálogo de impresión
      doc.output('dataurlnewwindow'); // Abrir en una nueva ventana para vista previa de impresión
    } else {
      doc.save(`Item Report (${format(StartDate, "yyyy-MM-dd")} - ${format(EndDate, "yyyy-MM-dd")}).pdf`); // Guardar como PDF
    }
  };

  return (
    <Button mr={2} colorScheme={forPrint ? 'red': 'blue'} onClick={handleExport} ml={4}>
      {forPrint ? "Print PDF" : "Download PDF"}
    </Button>
  );
};

export default ExportItemReportPDF;
