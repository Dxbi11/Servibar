import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ExportRowInvoiceReport = ({ invoice, forPrint }) => {

  const handleExport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const total = invoice.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Configuración de fuentes y colores
    doc.setFont("Helvetica", "normal");
    const primaryColor = [41, 128, 185]; // Azul profesional
    const secondaryColor = [52, 73, 94]; // Gris oscuro
    const accentColor = [231, 76, 60]; // Rojo para detalles

    // Logo del hotel (puedes reemplazar con una imagen base64 si tienes un logo)
    doc.setFontSize(20);
    doc.setTextColor(...primaryColor);
    doc.text("Invoice Report", pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);

    // Línea decorativa
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(10, 30, pageWidth - 10, 30);

    // Información de la factura
    doc.setFontSize(12);
    let yPosition = 40;
    doc.setTextColor(...secondaryColor);
    doc.text(`Fecha: ${format(invoice.date, "MM/dd/yy")}`, 14, yPosition);
    yPosition += 7;
    doc.text("Creada por: ___________________", 14, yPosition);
    yPosition += 7;
    doc.text(`Número de factura: ${invoice.id}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Número de Habitación: ${invoice.room}`, 14, yPosition);
    yPosition += 15;

    // Tabla de productos
    const tableColumns = ["CANTIDAD", "PRODUCTO", "PRECIO", "TOTAL"];
    const tableRows = invoice.items.map(item => [
      item.quantity,
      item.name,
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ]);

    // Estilo de la tabla
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: yPosition,
      theme: 'striped',
      styles: { 
        fontSize: 10,
        textColor: secondaryColor,
      },
      headStyles: { 
        fillColor: primaryColor, 
        textColor: [255, 255, 255], 
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'left' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      },
      foot: [['', '', 'TOTAL', `$${total.toFixed(2)}`]],
      footStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'right'
      }
    });

    // Pie de página
    const footerY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    // Línea decorativa final
    doc.setDrawColor(...primaryColor);
    doc.line(10, footerY + 15, pageWidth - 10, footerY + 15);

    // Guardar o imprimir
    if (forPrint) {
      doc.autoPrint();
      doc.output('dataurlnewwindow');
    } else {
      doc.save(`Factura-${invoice.id}.pdf`);
    }
  };

  return (
    <Button mr={2} colorScheme={forPrint ? 'red' : 'blue'} onClick={handleExport} ml={4}>
      {forPrint ? "Imprimir PDF" : "Descargar PDF"}
    </Button>
  );
};

export default ExportRowInvoiceReport;