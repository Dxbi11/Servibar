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

const ShowInvoicesByHotel = () => {
  useFetchInvoices();
  const { state } = useContext(store);
  const hotelId = state.ui.hotelId;
  const invoices = state.ui.invoices;
  console.log(invoices);
  const sortedInvoices = invoices.sort((a, b) => new Date(b.date) - new Date(a.date));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subtractTax, setSubtractTax] = useState(false);
  const [showInUSD, setShowInUSD] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [customTaxRate, setCustomTaxRate] = useState(0);
  const [days, setDays] = useState(); // State for the number of days

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
    setShowInUSD(!showInUSD);
  };

  const handleExchangeRateChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setExchangeRate(value);
    }
  };

  const handleRateSubmit = (event) => {
    event.preventDefault();
    // Additional validation if needed
  };

  const handleCustomTaxChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setCustomTaxRate(value);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading invoices: {error.message}</div>;

  return (
    <>
    <StatGroup mb={8} display="flex" alignItems="center" justifyContent="space-between">
      <Stat mr={4}>
        <StatLabel>Total for Today</StatLabel>
        <StatNumber>
          {showInUSD
            ? `₡${(totalForToday * exchangeRate).toFixed(2)}`
            : `$${totalForToday.toFixed(2)}`}
        </StatNumber>
      </Stat>
      <Stat mr={4}>
        <StatLabel>Total for Last {days} Days</StatLabel>
        <StatNumber>
          {showInUSD
            ? `₡${(totalForLastNDays * exchangeRate).toFixed(2)}`
            : `$${totalForLastNDays.toFixed(2)}`}
        </StatNumber>
      </Stat>

      <Box ml={4} mr={4}>
        <FormControl>
          <FormLabel>Days:</FormLabel>
          <Input
            type="number"
            value={days}
            onChange={handleDaysChange}
          />
        </FormControl>
      </Box>

      <Stack spacing={2} align="center" mr={8}>
        <Text>Subtract {subtractTax ? `${customTaxRate}%` : "Custom Tax Rate"}</Text>
        <Switch
          onChange={() => setSubtractTax(!subtractTax)}
          colorScheme="teal"
          size="md"
        />
      </Stack>


      <Stack spacing={2} align="center">
        <Text>{showInUSD ? "Show in USD" : "Show in CRC"}</Text>
        <Switch
          onChange={handleToggleCurrency}
          colorScheme="blue"
          size="md"
        >
        </Switch>
      </Stack>
    </StatGroup>

    {/* Exchange rate form */}
    <Box display={!showInUSD ? "none" : "block"} mb={8}>
      <FormControl as="form" onSubmit={handleRateSubmit} mb={4}>
        <FormLabel>Exchange Rate:</FormLabel>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={exchangeRate}
          onChange={handleExchangeRateChange}
          required
        />
        <Button type="submit" colorScheme="teal" size="sm" mt={2}>
          Set Rate
        </Button>
      </FormControl>
    </Box>

    {/* Popover for custom tax rate */}
    <Popover>
      <PopoverTrigger>
        <Button colorScheme="teal" size="sm" mt={2}>
          Set Custom Tax Rate
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Custom Tax Rate (%)</PopoverHeader>
        <PopoverBody>
          <FormControl>
            <FormLabel>Enter custom tax rate:</FormLabel>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={customTaxRate}
              onChange={handleCustomTaxChange}
            />
          </FormControl>
        </PopoverBody>
      </PopoverContent>
    </Popover>
    <>
    <Box display='flex' justifyContent='center'>
      {days && days > 0 ? <h1>Showing invoices for the last {days} days</h1> : <h1>Showing all invoices</h1>}
    </Box>
    <Box display="flex" justifyContent="center" mt={4}>
        <ExportToExcel
          invoices={invoices}
          showInUSD={showInUSD}
          exchangeRate={exchangeRate}
        />
        <Box ml={4}>
          <ExportToPDF
            invoices={invoices}
            showInUSD={showInUSD}
            exchangeRate={exchangeRate}
          />
        </Box>
        <Box ml={4}>
          <ExportToPDF
            invoices={invoices}
            showInUSD={showInUSD}
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
          <Th>Date</Th>
          <Th>Total</Th>
          <Th>Comment</Th>
          <Th>Room</Th>
        </Tr>
      </Thead>
      <Tbody>
      {days && days > 0
        ? invoicesForLastNDays.map((invoice) => (
            <Tr key={invoice.id}>
              <Td>{new Date(invoice.date).toLocaleDateString()}</Td>
              <Td>
                {showInUSD
                  ? `₡${(invoice.total * exchangeRate).toFixed(2)}`
                  : `$${invoice.total.toFixed(2)}`}
              </Td>
              <Td>{invoice.comment}</Td>
              <Td>{invoice.room}</Td>
            </Tr>
          ))
        : sortedInvoices.map((invoice) => (
            <Tr key={invoice.id}>
              <Td>{new Date(invoice.date).toLocaleDateString()}</Td>
              <Td>
                {showInUSD
                  ? `₡${(invoice.total * exchangeRate).toFixed(2)}`
                  : `$${invoice.total.toFixed(2)}`}
              </Td>
              <Td>{invoice.comment}</Td>
              <Td>{invoice.room}</Td>
            </Tr>
          ))}
    </Tbody>

    </Table>


    </>
  );
};

export default ShowInvoicesByHotel;
