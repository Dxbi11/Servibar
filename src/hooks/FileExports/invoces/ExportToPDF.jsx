import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ExportToPDF = ({ invoices, showInUSD, exchangeRate, forPrint }) => {
  const CurrentDay = new Date();

  const generatePDF = () => {
    const doc = new jsPDF();

    // Obtener el ancho de la página
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título principal centrado
    doc.setFontSize(18);
    doc.text("Report Invoices", pageWidth / 2, 20, { align: "center" });

    // Fecha de creación del reporte alineada a la izquierda
    doc.setFontSize(10);
    doc.text(`Date today: ${format(CurrentDay, "yyyy-MM-dd")}`, pageWidth / 2, 30, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(10, 35, pageWidth - 10, 35);
    // Título de la tabla centrado
    doc.setFontSize(14);
    doc.text("Invoice Detail", pageWidth / 2, 45, { align: "center" });

    // Definir columnas y filas
    const tableColumn = ["Date", "Total", "Comment", "Room"];
    const tableRows = [];

    invoices.forEach((invoice) => {
      const invoiceData = [
        format(new Date(invoice.date), "yyyy-MM-dd"),
        showInUSD
          ? `₡${(invoice.total * exchangeRate).toFixed(2)}`
          : `$${invoice.total.toFixed(2)}`,
        invoice.comment,
        invoice.room,
      ];
      tableRows.push(invoiceData);
    });

    // Agregar tabla debajo del título
    doc.autoTable({
      startY: 50, // Ajuste para que la tabla no se solape con los textos
      head: [tableColumn],
      body: tableRows,
    });

    if (forPrint) {
      doc.autoPrint();
      doc.output("dataurlnewwindow");
    } else {
      doc.save(`Invoices_${format(CurrentDay, "yyyy-MM-dd")}.pdf`);
    }
  };

  return (
    <>
      <Button colorScheme={forPrint ? "red" : "blue"} onClick={generatePDF}>
        {forPrint ? "Print PDF" : "Download PDF"}
      </Button>
    </>
  );
};

export default ExportToPDF;
