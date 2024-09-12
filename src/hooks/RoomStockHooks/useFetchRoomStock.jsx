import { useEffect, useState, useContext } from "react";
import { store } from "../../../store";
import {  getAllRoomStock } from "../../api";

const useFetchRoomStock = () => {
    const { state, dispatch } = useContext(store);
    const roomStock = state.ui.roomStock 
    const rooms = state.ui.rooms
    const hotelId = state.ui.hotelId
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredRoomStock, setFilteredRoomStock] = useState([]);

    const handleRoomStock = (roomStock) => {   
        const filtered = roomStock.filter(stock => stock.product.hotelId == hotelId);
        setFilteredRoomStock(filtered);
        console.log('Filtered Room Stock:', filtered);
        dispatch({
            type: "SET_ROOM_STOCK",
            payload: filtered
        });
        console.log('Dispatched SET_ROOM_STOCK action');
    }

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const roomStock = await getAllRoomStock();
            handleRoomStock(roomStock);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load room data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (rooms) {
            fetchData();
        }
    }, [hotelId]);

    return { isLoading, error };
}

export default useFetchRoomStock;
