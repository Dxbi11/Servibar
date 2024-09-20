import React from 'react';
import { Button, Box } from "@chakra-ui/react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from 'date-fns';

const ExportTableStoreHouseToPDF = ({ products, storeHouse }) => {
    const CurrentDay = new Date();
  const sortedStoreHouse = [...storeHouse].sort((a, b) => a.productId - b.productId);
  const sortedProducts = [...products].sort((a, b) => a.id - b.id);

  // Generar archivo PDF
  const generatePDF = () => {
    if (sortedStoreHouse.length === 0 || sortedProducts.length === 0) {
      alert("Data is not available. Please try again.");
      return;
    }

    const doc = new jsPDF();

    // Agregar título
    doc.text("StoreHouse Inventory Report", 14, 10);

    // Definir columnas de la tabla
    const columns = ["Product Name", "Quantity"];

    // Crear las filas para el PDF
    const rows = sortedStoreHouse.map((row, index) => [
      sortedProducts.find(product => product.id === row.productId)?.name || "Unknown Product",
      row.quantity
    ]);

    // Generar tabla en el PDF
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20, // Posición de la tabla después del título
    });

    // Guardar archivo PDF
    doc.save(`StoreHouse Inventory Report ${format(CurrentDay, 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <Box>
      <Button colorScheme="blue" onClick={generatePDF}>
        Export StoreHouse to PDF
      </Button>
    </Box>
  );
};

export default ExportTableStoreHouseToPDF;
