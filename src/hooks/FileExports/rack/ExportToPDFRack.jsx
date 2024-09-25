import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Button } from "@chakra-ui/react";
import { format } from "date-fns";

const ExportToPDF = ({ rooms, roomStocks, forPrint }) => {
  let CurrentDay = new Date();
  CurrentDay = format(CurrentDay, "yyyy-MM-dd");
  const [filteredRoomStocks, setFilteredRoomStocks] = useState({});

  useEffect(() => {
    const roomStockMap = {};

    // Filtrar roomStocks por roomId
    rooms.forEach((room) => {
      roomStockMap[room.id] = roomStocks.filter(
        (stock) => stock.roomId === room.id
      );
    });

    setFilteredRoomStocks(roomStockMap);
  }, [rooms, roomStocks]);

  const generatePDF = () => {
    if (Object.keys(filteredRoomStocks).length === 0) {
      alert("Room stocks data is not yet available. Please try again.");
      return;
    }

    const doc = new jsPDF();

    // Add title to the PDF
    doc.text("Rooms Rack Report", 14, 10);

    // Define table columns
    const columns = [
      "Room Number",
      "Status",
      "Locked",
      "Comment",
      "Room Stock",
    ];

    // Map rooms and their corresponding filtered roomStocks to table rows
    const rows = rooms.map((room) => {
      // Obtener el stock filtrado para este room
      const roomStockList =
        filteredRoomStocks[room.id]
          ?.map(
            (stock) =>
              `${stock.product?.name || "Unknown Product"}`
          )
          .join(", ") || "No products"; // Manejo si no hay stock

      return [
        room.roomNumber,
        getRoomStatus(room.state).label,
        room.locked ? "Locked" : "Unlocked",
        room.comment || "",
        roomStockList, // Room stock as a formatted string
      ];
    });

    // Add table to PDF
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20, // Position after title
    });

    // Save or print the PDF based on the `forPrint` flag
    if (forPrint) {
      doc.autoPrint(); // Abrir diálogo de impresión automáticamente
      doc.output("dataurlnewwindow"); // Abrir en una nueva ventana para vista previa de impresión
    } else {
      doc.save(`Rooms Rack Report ${CurrentDay}.pdf`); // Guardar el archivo PDF
    }
  };

  return (
    <Button
    ml={4}
    colorScheme={forPrint ? 'red': 'blue'}
      onClick={generatePDF}
      overflow="hidden"
      textOverflow="ellipsis" // Texto truncado si es demasiado largo
    >
      {forPrint ? "Print Rooms Rack PDF" : "Download Rooms Rack PDF"}
    </Button>
  );
};

export default ExportToPDF;

// Utility function to get room status
const getRoomStatus = (state) => {
  switch (state) {
    case 0:
      return { label: "Available", color: "green" };
    case 1:
      return { label: "In House", color: "blue" };
    case 2:
      return { label: "Leaving", color: "orange" };
    case 3:
      return { label: "Already Left", color: "red" };
    default:
      return { label: "Unknown", color: "gray" };
  }
};
