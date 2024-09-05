import { useEffect, useState, useContext } from "react";
import { store } from "../../../store";
import { createRoomStock } from "../../api";

const useCreateRoomStock = (roomId, productId, quantity= 0) => {
    const { state, dispatch } = useContext(store);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleRoomStock = (roomStock) => {
        dispatch({
            type: 'SET_ROOM_STOCK',
            payload: [...state.ui.roomStock, roomStock],
          });
    };

    const createData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const roomStock = await createRoomStock(roomId, productId, quantity);
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
            createData();
        }
    }, [roomId]);

    return { isLoading, error };
}

export default useCreateRoomStock;
