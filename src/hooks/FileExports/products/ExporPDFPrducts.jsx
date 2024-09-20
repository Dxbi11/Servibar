import React from "react";
import { Button } from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

const ExportProductsToPDF = ({ products }) => {
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

    doc.save(`Products ${format(CurrentDay, "yyyy-MM-dd")}.pdf`);
  };

  return (
    <Button mr={2} colorScheme="red" onClick={handleExport}>
      Download PDF
    </Button>
  );
};

export default ExportProductsToPDF;
