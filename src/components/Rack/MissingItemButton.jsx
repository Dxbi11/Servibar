import { useMemo, useCallback } from "react";
import useCreateRoomStock from "../../hooks/RoomStockHooks/useCreateRoomStock";
import { Button } from "@chakra-ui/react";

const MissingItemButton = ({ roomId, missingItems }) => {
  const { createData } = useCreateRoomStock();

  // Memoriza la lista filtrada para evitar recalcular en cada render
  const filteredMissingItems = useMemo(() => {
    return missingItems.find(item => item.roomId === roomId);
  }, [missingItems, roomId]);

  // Maneja la creación del item con una función memoizada
  const handleItemClick = useCallback((roomId, itemId, quantity) => {
    createData(roomId, itemId, quantity);
  }, [createData]);

  // Si no hay items, no renderiza nada
  if (!filteredMissingItems || !filteredMissingItems.missingItems.length) return null;

  return (
    <>
      {filteredMissingItems.missingItems.map((missingItem) => (
        <Button
          key={missingItem.id}
          onClick={() => handleItemClick(roomId, missingItem.id, 1)}
          bg="white"
          color="black"
          border="2px solid green"
          borderRadius="12px"
          textAlign="center" // Alineación centrada del texto
          overflow="hidden"
          textOverflow='ellipsis' // Texto truncado si es demasiado largo
          p="4px 8px"
          m="4px 2px"
        >
          {missingItem.name || 'Missing Item'}
        </Button>
      ))}
    </>
  );
};

export default MissingItemButton;
