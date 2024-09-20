import useDeleteRoomStock from "../../hooks/RoomStockHooks/useDeleteRoomStock";
import { Button } from "@chakra-ui/react";

const StockButton = ({ room, stock }) => {
  const { deleteData } = useDeleteRoomStock();

  const handleProductClick = (roomId, productId, stockId) => {
    deleteData(roomId, productId, stockId);
  };

  return (
    <Button
      onClick={() => handleProductClick(room.id, stock.productId, stock.id)}
      bg="red"
      color="white"
      border="2px solid red"
      borderRadius="12px"
      p="2px 4px" // Reduce padding
      m="4px 2px"
      overflow="hidden"
      textOverflow="ellipsis" // Texto truncado si es demasiado largo
      whiteSpace= 'normal'
      maxW="150px" // Establecer un ancho máximo
      minH="40px" // Establecer una altura mínima
      display="flex" // Usar flexbox para centrar el contenido
      alignItems="center" // Centrar verticalmente
      justifyContent="center" // Centrar horizontalmente
      fontSize="sm" // Ajustar el tamaño de fuente si es necesario
    >
      {stock.product?.name || 'Unknown Product'}
    </Button>
  );
};

export default StockButton;
