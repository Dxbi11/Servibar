import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@chakra-ui/react";
import { format } from "date-fns";

const ExportToExcel = ({ rooms, roomStocks }) => {
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

  const generateExcel = () => {
    if (Object.keys(filteredRoomStocks).length === 0) {
      alert("Room stocks data is not yet available. Please try again.");
      return;
    }

    // Define Excel columns
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
          ?.map((stock) => `${stock.product?.name || "Unknown Product"}`)
          .join(", ") || "No products"; // Manejo si no hay stock

      return {
        "Room Number": room.roomNumber,
        Status: getRoomStatus(room.state).label,
        Locked: room.locked ? "Locked" : "Unlocked",
        Comment: room.comment || "",
        "Room Stock": roomStockList, // Room stock as a formatted string
      };
    });

    // Crear una hoja de trabajo de Excel
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: columns });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rooms Rack Report");

    // Generar archivo Excel
    XLSX.writeFile(workbook, `Rooms_Rack_Report_${CurrentDay}.xlsx`);
  };

  return (
    <Button ml={4} colorScheme="green" onClick={generateExcel}>
      Export Rooms to Excel
    </Button>
  );
};

export default ExportToExcel;

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
