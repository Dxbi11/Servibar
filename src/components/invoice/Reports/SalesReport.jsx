import React from "react";
import { useContext, useState } from "react";
import { store } from "../../../../store";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import ExportSalesReportPDF from "../../../hooks/FileExports/reports/ExportSalesReportPDF";

const SalesReport = () => {
    const { state } = useContext(store);
    const invoices = state.ui.invoices;
    const [StartDate, setStartDate] = useState("");
    const [EndDate, setEndDate] = useState("");
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [substractTax, setSubstractTax] = useState(0);
    console.log(substractTax);
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
                    <ExportSalesReportPDF
                        invoices={filteredInvoices}
                        StartDate={StartDate}
                        EndDate={EndDate}
                        substractTax={substractTax} // Passed as a number
                        forPrint={false}
                    />
                    <ExportSalesReportPDF
                        invoices={filteredInvoices}
                        StartDate={StartDate}
                        EndDate={EndDate}
                        substractTax={substractTax} // Passed as a number
                        forPrint={true}
                    />
                </div>
            )}
        </div>
    );
};

export default SalesReport;
