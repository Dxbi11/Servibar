import { useState, useContext } from 'react';
import { store } from '../../../store';
import { createHotel } from '../../api';
import { useToast } from "@chakra-ui/react";

const useCreateHotel = () => {
  const { state, dispatch } = useContext(store);
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (hotelData) => {
    setLoading(true);
    setError(null);

    try {
      const newHotel = await createHotel(hotelData);

      dispatch({
        type: 'SET_HOTELS',
        payload: [...state.ui.hotels, newHotel],
      });

      toast({
        title: "Hotel added successfully",
        description: `Hotel ${hotelData.name} added successfully!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setError(error);
      toast({
        title: "Failed to add hotel",
        description: error.message,
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

export default useCreateHotel;
