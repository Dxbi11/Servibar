import { useEffect, useState, useContext } from "react";
import { store } from "../../../store";
import { getStoreHouseByHotelId } from "../../api";

const useFetchStoreHouse = () => {
    const { state, dispatch } = useContext(store);
    const HotelId = state.ui.hotelId;
    const products = state.ui.products;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleRooms = (storeHouse) => {
        dispatch({ type: "SET_STORE_HOUSE", payload: storeHouse });
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const storeHouseData = await getStoreHouseByHotelId(HotelId);
            handleRooms(storeHouseData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load room data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (HotelId) {
            fetchData();
        }
    }, [products]);

    return { isLoading, error };
}

export default useFetchStoreHouse;