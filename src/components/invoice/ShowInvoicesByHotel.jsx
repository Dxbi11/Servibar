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
} from "@chakra-ui/react";
import useFetchInvoices from "../../hooks/InvoiceHooks/useFetchInvoices";
import ExportToExcel from "../../hooks/FileExports/invoces/ExportToExcel";
import ExportToPDF from "../../hooks/FileExports/invoces/ExportToPDF";

const ShowInvoicesByHotel = () => {
  useFetchInvoices();
  const { state } = useContext(store);
  const hotelId = state.ui.hotelId;
  const invoices = state.ui.invoices;
  const sortedInvoices = invoices.sort((a, b) => new Date(b.date) - new Date(a.date));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subtractTax, setSubtractTax] = useState(false);
  const [showInUSD, setShowInUSD] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [customTaxRate, setCustomTaxRate] = useState(0);
  const [days, setDays] = useState(10); // State for the number of days

  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - days); // Dynamic days based on user input

  const invoicesForToday = invoices.filter(
    (invoice) => new Date(invoice.date).toDateString() === today.toDateString()
  );

  const invoicesForLastNDays = invoices.filter(
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
  const totalForLastNDays = calculateTotal(invoicesForLastNDays);

  const handleDaysChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0) {
      setDays(value);
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
      <StatGroup mb={4} display="flex" alignItems="center" justifyContent="space-between">
        <Stat>
          <StatLabel>Total for Today</StatLabel>
          <StatNumber>
            {showInUSD
              ? `₡${(totalForToday * exchangeRate).toFixed(2)}`
              : `$${totalForToday.toFixed(2)}`}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total for Last {days} Days</StatLabel>
          <StatNumber>
            {showInUSD
              ? `₡${(totalForLastNDays * exchangeRate).toFixed(2)}`
              : `$${totalForLastNDays.toFixed(2)}`}
          </StatNumber>
        </Stat>

        <Box ml={4}>
          <FormControl>
            <FormLabel>Days:</FormLabel>
            <Input
              type="number"
              value={days}
              onChange={handleDaysChange}
              min={0}
            />
          </FormControl>
        </Box>

        <Box display="flex" alignItems="center">
          <Switch
            onChange={() => setSubtractTax(!subtractTax)}
            colorScheme="teal"
            size="md"
            mt={2}
          >
            Subtract {subtractTax ? `${customTaxRate}%` : "Custom Tax Rate"}
          </Switch>
          <Box ml={4}>
            <Switch
              onChange={handleToggleCurrency}
              colorScheme="blue"
              size="md"
              mt={2}
            >
              {showInUSD ? "Show in USD" : "Show in CRC"}
            </Switch>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" mt={4} ml={4}>
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
        </Box>
      </StatGroup>


      <Box display={!showInUSD ? "none" : "block"}>
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

      <Table variant="simple">
        <TableCaption>Invoices for Hotel ID: {hotelId}</TableCaption>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Total</Th>
            <Th>Date</Th>
            <Th>Comment</Th>
            <Th>Room</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedInvoices.map((invoice) => (
            <Tr key={invoice.id}>
              <Td>{invoice.id}</Td>
              <Td>
                {showInUSD
                  ? `₡${(invoice.total * exchangeRate).toFixed(2)}`
                  : `$${invoice.total.toFixed(2)}`}
              </Td>
              <Td>{new Date(invoice.date).toLocaleDateString()}</Td>
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
