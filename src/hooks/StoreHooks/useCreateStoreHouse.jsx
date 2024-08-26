import { useState, useContext } from 'react';
import { store } from '../../../store';
import { createStoreHouse } from '../../api';
import { useToast } from "@chakra-ui/react";

const useCreateInvoice = () => {
  const { state, dispatch } = useContext(store);
  const hotelId = state.ui.hotelId;
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (StoreHouseData) => {
    setLoading(true);
    setError(null);

    try {
      const newStoreHouse = await createStoreHouse(StoreHouseData);
      // Dispatch an action to add the new invoice to the context
      dispatch({
        type: 'SET_STORE_HOUSE',
        payload: [...state.ui.storeHouse, newStoreHouse],
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error };
};

export default useCreateInvoice;
