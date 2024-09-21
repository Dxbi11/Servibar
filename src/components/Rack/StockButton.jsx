import { Button } from "@chakra-ui/react";

const StockButton = ({ room, stock, onClick, selected }) => {
  return (
    <Button
      bg={selected ? "green" : "red"} // Cambiar color si está seleccionado
      color="white"
      border="2px solid red"
      borderRadius="12px"
      p="2px 4px"
      m="4px 2px"
      overflow="hidden"
      textOverflow="ellipsis"
      whiteSpace='normal'
      maxW="150px"
      minH="40px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="sm"
      onClick={onClick} // Manejar clic en el botón
    >
      {stock.product?.name || 'Unknown Product'}
    </Button>
  );
};

export default StockButton;
