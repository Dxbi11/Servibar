import { useState, useContext } from 'react';
import { store } from '../../../store';
import { createInvoice } from '../../api';
import { useToast } from "@chakra-ui/react";

const useCreateInvoice = () => {
  const { state, dispatch } = useContext(store);
  const hotelId = state.ui.hotelId;
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (invoiceData) => {
    setLoading(true);
    setError(null);

    try {
      const newInvoice = await createInvoice(invoiceData);

      // Dispatch an action to add the new invoice to the context
      dispatch({
        type: 'SET_INVOICES',
        payload: [...state.ui.invoices, newInvoice],
      });

      toast({
        title: "Invoice created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setError(error);
      toast({
        title: "Failed to create invoice",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error };
};

export default useCreateInvoice;
