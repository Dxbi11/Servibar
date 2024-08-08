import React, { useEffect, useState } from "react";
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
import { getInvoicesByHotelId } from "../../api"; // Adjust the import path as necessary

const ShowInvoicesByHotel = ({ hotelId }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subtractTax, setSubtractTax] = useState(false);
  const [showInUSD, setShowInUSD] = useState(false); // Adjust initial state as needed
  const [exchangeRate, setExchangeRate] = useState(1);
  const [customTaxRate, setCustomTaxRate] = useState(0); // State for custom tax rate

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 10);
        const formattedStartDate = startDate.toISOString();

        const data = await getInvoicesByHotelId(hotelId, formattedStartDate);
        setInvoices(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [hotelId]);

  const today = new Date();
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  const invoicesForToday = invoices.filter(
    (invoice) => new Date(invoice.date).toDateString() === today.toDateString()
  );
  const invoicesForLast10Days = invoices.filter(
    (invoice) =>
      new Date(invoice.date) >= tenDaysAgo && new Date(invoice.date) <= today
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
  const totalForLast10Days = calculateTotal(invoicesForLast10Days);

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
      <StatGroup mb={4}>
        <Stat>
          <StatLabel>Total for Today</StatLabel>
          <StatNumber>
            {showInUSD
              ? `₡${(totalForToday * exchangeRate).toFixed(2)}`
              : `$${totalForToday.toFixed(2)}`}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total for Last 10 Days</StatLabel>
          <StatNumber>
            {showInUSD
              ? `₡${(totalForLast10Days * exchangeRate).toFixed(2)}`
              : `$${totalForLast10Days.toFixed(2)}`}
          </StatNumber>
        </Stat>
        <Switch
          onChange={() => setSubtractTax(!subtractTax)}
          colorScheme="teal"
          size="md"
          mt={2}
        >
          Subtract {subtractTax ? `${customTaxRate}%` : "Custom Tax Rate"}
        </Switch>
        <Switch
          onChange={handleToggleCurrency}
          colorScheme="blue"
          size="md"
          mt={2}
        >
          {showInUSD ? "Show in CRC" : "Show in USD"}
        </Switch>
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
          {invoices.map((invoice) => (
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
