import { useEffect, useState, useContext } from "react";
import { store } from "../../../store";
import { getRoomStock } from "../../api";

const useFetchRoomStock = (roomId) => {
    const { state, dispatch } = useContext(store);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleRoomStock = (roomStock) => {
        dispatch({ type: "SET_ROOM_STOCK", payload: roomStock });
    };

    const fetchData = async (roomId) => {
        setIsLoading(true);
        setError(null);
        try {
            const roomStock = await getRoomStock(roomId);
            handleRoomStock(roomStock);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load room data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (roomId) {
            fetchData(roomId);
        }
    }, [roomId]);

    return { isLoading, error };
}

export default useFetchRoomStock;
