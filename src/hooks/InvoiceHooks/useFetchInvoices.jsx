import { useState, useEffect, useContext } from 'react';
import { store } from '../../../store';
import { getInvoicesByHotelId } from '../../api';

const useFetchInvoices = () => {
    const { state, dispatch } = useContext(store);
    const hotelId = state.ui.hotelId;

    const handleInvoices = (invoices) => {
        dispatch({ type: 'SET_INVOICES', payload: invoices });
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shouldFetch, setShouldFetch] = useState(false);

    useEffect(() => {
        if (hotelId) {
            setShouldFetch(true);
        }
    }, [hotelId]);

    useEffect(() => {
        const fetchInvoices = async () => {
            if (!shouldFetch) return;
            setLoading(true);
            setError(null);
            try {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 10);
                const formattedStartDate = startDate.toISOString();

                const data = await getInvoicesByHotelId(hotelId, formattedStartDate);
                handleInvoices(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, [shouldFetch, hotelId]);

    return { loading, error };
};

export default useFetchInvoices;
