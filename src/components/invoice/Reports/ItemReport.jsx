import React from "react";
import { useContext, useState } from "react";
import { store } from "../../../../store";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

const ItemReport = () => {
    const { state } = useContext(store);
    const invoices = state.ui.invoices;
    const [StartDate, setStartDate] = useState("");
    const [EndDate, setEndDate] = useState("");
    console.log(StartDate);

    const handleFilterByDate = () => {
        const filteredInvoices = invoices.filter((invoice) => {
            const invoiceDate = new Date(invoice.date);
            const startDate = new Date(StartDate);
            const endDate = new Date(EndDate);
            return invoiceDate >= startDate && invoiceDate <= endDate;
        });
        console.log(filteredInvoices);
    }

    return (
        <div>
            {invoices.map((invoice) => (
                invoice.items.map((item) => (
                    <div key={item.id}>
                        <h2>{item.productId}</h2>
                    </div>
                ))
            ))}
            <FormControl id="date">
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={StartDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
            </FormControl>
            <FormControl id="date">
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  value={EndDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
            </FormControl>
            {StartDate !== '' && EndDate !== "" ? (
                <Button onClick={() => handleFilterByDate()}>Generate Report</Button>
            ): null}
        </div>
    )
}

export default ItemReport;