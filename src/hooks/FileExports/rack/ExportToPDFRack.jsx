import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Button } from "@chakra-ui/react";

const ExportToPDF = ({ rooms, roomStocks }) => {
    console.log(roomStocks);
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title to the PDF
    doc.text("Rooms Rack Report", 14, 10);

    // Define table columns
    const columns = [
      "Room Number", 
      "Status", 
      "Locked", 
      "Daily Check", 
      "Comment", 
      "Room Stock"
    ];

    // Map rooms and their corresponding roomStocks to table rows
    const rows = rooms.map((room, index) => {
      // Ensure roomStocks[index] is an array, otherwise fallback to an empty array
      const roomStockList = Array.isArray(roomStocks[index])
        ? roomStocks[index].map(
            (stock) => `${stock.product?.name || 'Unknown Product'} (${stock.quantity})`
          ).join(", ")
        : "No products"; // Handle if no stock or not an array
          
    console.log(roomStocks[index]);
      return [
        room.roomNumber,
        getRoomStatus(room.state).label,
        room.locked ? "Locked" : "Unlocked",
        room.checked ? "Checked" : "Not Checked",
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

    // Save the PDF
    doc.save("rooms_rack_report.pdf");
  };

  return (
    <Button colorScheme="blue" onClick={generatePDF}>
      Export Rooms to PDF
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
