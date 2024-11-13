import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { store } from "../../../../store";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import ExportItemReportPDF from "../../../hooks/FileExports/reports/ExportItemReportPDF";
import { format } from "date-fns";

const ItemReport = () => {
    const { state } = useContext(store);
    const invoices = state.ui.invoices;
    const [StartDate, setStartDate] = useState("");
    const [EndDate, setEndDate] = useState("");
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [Items, setItems] = useState([]);
    const [itemTotals, setItemTotals] = useState([]);




    const handleFilterByDate = () => {
        const filteredInvoices = invoices.filter((invoice) => {
            const invoiceDate = format(new Date(invoice.date), "yyyy-MM-dd");
            const startDate = format(StartDate, "yyyy-MM-dd");
            const endDate = format(EndDate, "yyyy-MM-dd");
            return invoiceDate >= startDate && invoiceDate <= endDate;
        })
        setFilteredInvoices(filteredInvoices);
        console.log(filteredInvoices);
    }
    useEffect(() => {
        if (filteredInvoices.length > 0) {
          const itemTotals = [];
    
          filteredInvoices.forEach((invoice) => {
            invoice.items.forEach((item) => {
              const existingItem = itemTotals.find((total) => total.name === item.name);
    
              if (existingItem) {
                // If the item already exists, update its total quantity and price
                existingItem.quantity += item.quantity;
                existingItem.total += item.price * item.quantity;
              } else {
                // If the item doesn't exist, add a new entry
                itemTotals.push({
                  name: item.name,
                  quantity: item.quantity,
                  total: item.price * item.quantity,
                });
              }
            });
          });
    
          setItems(itemTotals); // Update Items state with the calculated totals
        } else {
          setItems([]); // Reset Items if there are no filtered invoices
        }
      }, [filteredInvoices]);
      

    return (
        <div>
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

            {filteredInvoices.length > 0 && 
            <div>
                <ExportItemReportPDF invoices={filteredInvoices} StartDate={StartDate} EndDate={EndDate} forPrint={false} Items={Items}/>
                <ExportItemReportPDF invoices={filteredInvoices} StartDate={StartDate} EndDate={EndDate} forPrint={true} Items={Items} />
            </div>
            }
        </div>
    )
}

export default ItemReport;