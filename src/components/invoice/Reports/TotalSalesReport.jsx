import React from "react";
import { useContext, useState, useEffect } from "react";
import { store } from "../../../../store";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import ExportTotalSalesReportPDF from "../../../hooks/FileExports/reports/ExportTotalSalesReportPDF";

const TotalSalesReport = () => {
    const { state } = useContext(store);
    const invoices = state.ui.invoices;
    const [StartDate, setStartDate] = useState("");
    const [EndDate, setEndDate] = useState("");
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [substractTax, setSubstractTax] = useState(0);
    const [Total, setTotal] = useState([]);

    const handleFilterByDate = () => {
        const filteredInvoices = invoices.filter((invoice) => {
            const invoiceDate = new Date(invoice.date);
            const startDate = new Date(StartDate);
            const endDate = new Date(EndDate);
            return invoiceDate >= startDate && invoiceDate <= endDate;
        });
        setFilteredInvoices(filteredInvoices);
    };

    const handleExchangeRateChange = (event) => {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
            setSubstractTax(value);
        }
      };

      useEffect(() => {
        if (filteredInvoices.length > 0) {
          const TotalSales = [];
      
          filteredInvoices.forEach((invoice) => {
            // Extract the date part only (yyyy-mm-dd)
            const invoiceDate = new Date(invoice.date).toISOString().split('T')[0];
      
            const existingDate = TotalSales.find((total) => total.date === invoiceDate);
            
            if (existingDate) {
              // If the date already exists, update the total sales for that date
              existingDate.total += invoice.total;
            } else {
              // If the date doesn't exist, add a new entry
              TotalSales.push({
                date: invoiceDate, // Store the date part only
                total: invoice.total,
              });
            }
          });
      
          console.log("Grouped Total Sales by Date:", TotalSales); // Log the results
      
          setTotal(TotalSales); // Update TotalSales state with the calculated totals
        } else {
          setTotal([]); // Reset if there are no filtered invoices
        }
      }, [filteredInvoices]);
      
      

    useEffect(() => {
        console.log(Total);
    }, [Total]);

    return (
        <div>
            <FormControl id="start-date">
                <FormLabel>Start Date</FormLabel>
                <Input
                    type="date"
                    value={StartDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </FormControl>
            <FormControl id="end-date">
                <FormLabel>End Date</FormLabel>
                <Input
                    type="date"
                    value={EndDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </FormControl>
            <FormControl id="tax">
                <FormLabel>Tax percentage (%)</FormLabel>
                <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={substractTax}
                    onChange={handleExchangeRateChange}
                    required
                />
            </FormControl>
            {StartDate !== "" && EndDate !== "" ? (
                <Button onClick={handleFilterByDate}>Generate Report</Button>
            ) : null}

            {filteredInvoices.length > 0 && (
                <div>
                    <ExportTotalSalesReportPDF
                        invoices={filteredInvoices}
                        StartDate={StartDate}
                        EndDate={EndDate}
                        substractTax={substractTax} // Passed as a number
                        forPrint={false}
                        Sales={Total}
                    />
                    <ExportTotalSalesReportPDF
                        invoices={filteredInvoices}
                        StartDate={StartDate}
                        EndDate={EndDate}
                        substractTax={substractTax} // Passed as a number
                        forPrint={true}
                        Sales={Total}
                    />
                </div>
            )}
        </div>
    );
};

export default TotalSalesReport;