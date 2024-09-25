import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ExportProductsToPDF = ({ products, forPrint }) => {
  const CurrentDay = new Date();

  const handleExport = () => {
    const doc = new jsPDF();

    const tableColumn = ["ID", "Name", "Price"];
    const tableRows = [];

    products.forEach((product) => {
      const productData = [
        product.id,
        product.name,
        `$${product.price.toFixed(2)}`,
      ];
      tableRows.push(productData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    if (forPrint) {
      doc.autoPrint(); // Abrir cuadro de diálogo de impresión
      doc.output('dataurlnewwindow'); // Abrir en una nueva ventana para vista previa de impresión
    } else {
      doc.save(`Products ${format(CurrentDay, "yyyy-MM-dd")}.pdf`); // Guardar como PDF
    }
  };

  return (
    <Button mr={2} colorScheme={forPrint ? 'red': 'blue'} onClick={handleExport} ml={4}>
      {forPrint ? "Print PDF" : "Download PDF"}
    </Button>
  );
};

export default ExportProductsToPDF;
