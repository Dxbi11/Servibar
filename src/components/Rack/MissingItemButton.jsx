import React, { useMemo, useCallback, useState } from "react";
import useCreateRoomStock from "../../hooks/RoomStockHooks/useCreateRoomStock";
import { Button, Flex, Box } from "@chakra-ui/react";

const MissingItemButton = ({ roomId, missingItems }) => {
  const { createData } = useCreateRoomStock();
  const [selectedItems, setSelectedItems] = useState({});

  // Filtrar los items faltantes por el roomId proporcionado
  const filteredMissingItems = useMemo(() => {
    return missingItems.find((item) => item.roomId === roomId);
  }, [missingItems, roomId]);
  // Manejar la selección de cada item al hacer clic
  const handleItemClick = useCallback((itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId], // Alternar entre seleccionado/no seleccionado
    }));
  }, []);

  // Confirmar y crear los items seleccionados
  const handleConfirm = useCallback(() => {
    const selectedItemIds = Object.entries(selectedItems)
      .filter(([itemId, isSelected]) => isSelected) // Filtrar los seleccionados
      .map(([itemId]) => parseInt(itemId, 10)); // Obtener solo los IDs seleccionados

    // Crear cada item seleccionado
    selectedItemIds.forEach((itemId) => {
      createData(roomId, itemId, 1); // Asume cantidad de 1 para cada ítem
    });

    // Limpiar la selección después de la confirmación
    setSelectedItems({});
  }, [selectedItems, roomId, createData]);

  // Si no hay items faltantes, no renderizar el botón
  if (!filteredMissingItems || !filteredMissingItems.missingItems.length) return null;

  return (
    <Box>
      {/* Mostrar botones para cada item faltante */}
      <Flex flexWrap="wrap" mb={2}>
        {filteredMissingItems.missingItems.map((missingItem) => (
          <Button
            key={missingItem.id}
            onClick={() => handleItemClick(missingItem.id)}
            bg={selectedItems[missingItem.id] ? "green.100" : "white"}
            color="black"
            border="2px solid green"
            borderRadius="12px"
            textAlign="center"
            overflow="hidden"
            textOverflow="ellipsis"
            p="4px 8px"
            m="4px 2px"
          >
            {missingItem.name || "Missing Item"}
          </Button>
        ))}
      </Flex>

      <Button
        onClick={handleConfirm}
        colorScheme="green"
        isDisabled={Object.values(selectedItems).every((v) => !v)} // Deshabilitar si no hay ítems seleccionados o está cargando
      >
        Confirm Stock Changes
      </Button>


    </Box>
  );
};

export default MissingItemButton;
