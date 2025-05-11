import React, { useEffect, useState, useContext } from "react";
import { store } from "../../../store";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Stack,
  Text,
} from "@chakra-ui/react";
import useFetchInvoices from "../../hooks/InvoiceHooks/useFetchInvoices";
import ExportToExcel from "../../hooks/FileExports/invoces/ExportToExcel";
import ExportToPDF from "../../hooks/FileExports/invoces/ExportToPDF";
import ExportRowInvoiceReport from "../../hooks/FileExports/reports/ExportRowInvoiceReport";
import { updateInvoice } from '../../api';
import { useToast } from "@chakra-ui/react";

const ShowInvoicesByHotel = () => {
  useFetchInvoices();
  const { toast } = useToast()
  const { state, dispatch } = useContext(store);
  const hotelId = state.ui.hotelId;
  const invoices = state.ui.invoices;
  const sortedInvoices = invoices.sort((a, b) => new Date(b.date) - new Date(a.date));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subtractTax, setSubtractTax] = useState(false);
  const [ShowInCRC, setShowInCRC] = useState(false);
  const [exchangeRate, setExchangeRate] = useState()
  const [customTaxRate, setCustomTaxRate] = useState(0);
  const [days, setDays] = useState(0); // State for the number of days
  const [montos, setMontos] = useState({});	
  const [editingMontoHotel, setEditingMontoHotel] = useState({});

  const today = new Date();
  const pastDate = new Date();
  today.setHours(0, 0, 0, 0);
  pastDate.setHours(0, 0, 0, 0);
  pastDate.setDate(pastDate.getDate() - days); // Dynamic days based on user input

  const invoicesForToday = invoices.filter(
    (invoice) => new Date(invoice.date).toDateString() === today.toDateString()
  );

  const invoicesForLastNDays = 
  invoices.filter(
    (invoice) => new Date(invoice.date) >= pastDate && new Date(invoice.date) <= today
  );

  const calculateTotal = (invoicesList) =>
    invoicesList.reduce((acc, invoice) => {
      const total = invoice.total || 0;
      const adjustedTotal = subtractTax
        ? total * (1 - customTaxRate / 100)
        : total;
      return acc + adjustedTotal;
    }, 0);

  const totalForToday = calculateTotal(invoicesForToday);
  const totalForLastNDays = days > 0 ? calculateTotal(invoicesForLastNDays) : calculateTotal(invoices);

  const handleDaysChange = (event) => {
    const value = event.target.value;
    
    if (value === '') {
      setDays(''); // Allow clearing the input field
    } else {
      const parsedValue = parseInt(value);
      if (!isNaN(parsedValue) && parsedValue >= 0) {
        setDays(parsedValue);
      }
    }
  };
  

  const handleToggleCurrency = () => {
    setShowInCRC(!ShowInCRC);
  };

  const handleExchangeRateChange = (event) => {
    const value = event.target.value;
    setExchangeRate(value === "" ? null : parseFloat(value));
    if (value > 0) {
      setShowInCRC(true);
    }
    else {
      setShowInCRC(false);
    }

  };

  const handleRateSubmit = (event) => {
    event.preventDefault();
    // Additional validation if needed
  };

  const handleCustomTaxChange = (event) => {
    const value = event.target.value;
    setCustomTaxRate(value === "" ? null : parseFloat(value));
  };

  const handleMontoHotelChange = (invoice, e) => {
    const newMonto = e.target.value;
    setEditingMontoHotel((prev) => ({ ...prev, [invoice.id]: newMonto }));
  };
  
  const handleSaveMontoHotel = async (invoice) => {
    const newValue = editingMontoHotel[invoice.id];
  
    if (newValue !== undefined && !isNaN(parseFloat(newValue))) {
      const parsedValue = parseFloat(newValue);
      dispatch({
        type: "UPDATE_INVOICE",
        payload: { ...invoice, montohotel: parsedValue },
      });
      
      
      try {
        const updatedInvoice = await updateInvoice(invoice.id, {
          montohotel: parsedValue, // Asegurar que se envía el dato
        });
        console.log("Respuesta de la API:", updatedInvoice);
        
        setMontos((prev) => ({ ...prev, [invoice.id]: updatedInvoice.montohotel }));
  
        setEditingMontoHotel((prev) => {
          const updated = { ...prev };
          delete updated[invoice.id];
          return updated;
        });
      } catch (error) {
        console.error("Error al actualizar la factura:", error);
      }
    }
  };
  
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading invoices: {error.message}</div>;

  return (
    <>
    <StatGroup mb={8} display="flex" flexDirection="column" alignItems="center">
      <Stack spacing={6} align="center" width="100%">
        
        
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={12}>
          <Stat textAlign="center">
            <StatLabel>Total for Today</StatLabel>
            <StatNumber>
              {ShowInCRC
                ? `₡${(totalForToday * exchangeRate).toFixed(2)}`
                : `$${totalForToday.toFixed(2)}`}
            </StatNumber>
          </Stat>

          <Stat textAlign="center">
            <StatLabel>{days > 0 ? `Total for Last ${days} Days` : "Total sales"}</StatLabel>
            <StatNumber>
              {ShowInCRC
                ? `₡${(totalForLastNDays * exchangeRate).toFixed(2)}`
                : `$${totalForLastNDays.toFixed(2)}`}
            </StatNumber>
            {subtractTax && (
              <Text textColor="red" fontSize={16} fontWeight="bold">
                Subtract {customTaxRate}%
              </Text>
            )}
          </Stat>
        </Box>

        
        <Box display="flex" gap={4} justifyContent="center" alignItems="flex-end">
          <FormControl textAlign="center" maxWidth="200px">
            <FormLabel>Days:</FormLabel>
            <Input type="number" value={days} onChange={handleDaysChange} textAlign="center" />
          </FormControl>
            <FormControl textAlign="center" maxWidth="200px" ml={8}>
              <FormLabel>Enter custom tax rate:</FormLabel>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={customTaxRate === null ? "" : customTaxRate}
                onChange={handleCustomTaxChange}
                textAlign="center"
              />
            </FormControl>
              <Button 
                mr={8}
                colorScheme={subtractTax ? "red": "teal"} 
                onClick={() => setSubtractTax(!subtractTax)} 
                fontSize="sm"
                alignSelf="flex-end" 
                width="50%"
              >
                {subtractTax ? "desactivate tax rate" : "Set custom tax rate"}
              </Button>
          <FormControl as="form" onSubmit={handleRateSubmit} textAlign="center" maxWidth="250px">
            <FormLabel>Exchange Rate (CRC):</FormLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="₡"
              value={exchangeRate}
              onChange={handleExchangeRateChange}
              required
              textAlign="center"
            />
          </FormControl>
        </Box>

      </Stack>
    </StatGroup>


    <>
    <Box display='flex' justifyContent='center'>
      {days && days > 0 ? <h1>Showing invoices for the last {days} days</h1> : <h1>Showing all invoices</h1>}
    </Box>
    <Box display="flex" justifyContent="center" mt={4}>
        <ExportToExcel
          invoices={invoices}
          ShowInCRC={ShowInCRC}
          exchangeRate={exchangeRate}
        />
        <Box ml={4}>
          <ExportToPDF
            invoices={invoices}
            ShowInCRC={ShowInCRC}
            exchangeRate={exchangeRate}
          />
        </Box>
        <Box ml={4}>
          <ExportToPDF
            invoices={invoices}
            ShowInCRC={ShowInCRC}
            exchangeRate={exchangeRate}
            forPrint={true}  // Set forPrint to true for the print button
          />
        </Box>
      </Box>
    </>
    {/* Table */}
    <Table variant="simple" mt={8}>
      <TableCaption>Invoices for Hotel ID: {hotelId}</TableCaption>
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Date</Th>
          <Th>Total</Th>
          <Th>Monto Hotel</Th>
          <Th>Comment</Th>
          <Th>Room</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
      {days && days > 0
        ? invoicesForLastNDays.map((invoice) => (
            <Tr key={invoice.id}>
              <Td>{invoice.id}</Td>
              <Td>{new Date(invoice.date).toLocaleDateString()}</Td>
              <Td>
                {ShowInCRC
                  ? `₡${(invoice.total * exchangeRate).toFixed(2)}`
                  : `$${invoice.total.toFixed(2)}`}
              </Td>
              <Td>
                <Stack direction="row" spacing={2} align="center">
                  <Input
                    size="sm"
                    width="100%"
                    value={editingMontoHotel[invoice.id] ?? montos[invoice.id] ?? invoice.montohotel ?? ""}
                    onChange={(e) => handleMontoHotelChange(invoice, e)}
                    placeholder="Enter monto hotel"
                  />
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => handleSaveMontoHotel(invoice)}
                  >
                    Save
                  </Button>
                </Stack>
              </Td>;
              <Td>{invoice.comment}</Td>
              <Td>{invoice.room}</Td>
              <Td><ExportRowInvoiceReport forPrint={true} invoice={invoice} /></Td>
            </Tr>
          ))
        : sortedInvoices.map((invoice) => (
            <Tr key={invoice.id}>
              <Td>{invoice.id}</Td>
              <Td>{new Date(invoice.date).toLocaleDateString()}</Td>
              <Td>
                {ShowInCRC
                  ? `₡${(invoice.total * exchangeRate).toFixed(2)}`
                  : `$${invoice.total.toFixed(2)}`}
              </Td>
              <Td>
                <Stack direction="row" spacing={2} align="center">
                  <Input
                    size="sm"
                    width="100%"
                    value={editingMontoHotel[invoice.id] ?? montos[invoice.id] ?? invoice.montohotel ?? ""}
                    onChange={(e) => handleMontoHotelChange(invoice, e)}
                    placeholder="Enter monto hotel"
                  />
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => handleSaveMontoHotel(invoice)}
                  >
                    Save
                  </Button>
                </Stack>
              </Td>
              <Td>{invoice.comment}</Td>
              <Td>{invoice.room}</Td>
              <Td><ExportRowInvoiceReport forPrint={true} invoice={invoice} /></Td>
            </Tr>
          ))}
    </Tbody>

    </Table>


    </>
  );
};

export default ShowInvoicesByHotel;
