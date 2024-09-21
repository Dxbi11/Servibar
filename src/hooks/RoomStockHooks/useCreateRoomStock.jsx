import { useState, useContext } from "react";
import { store } from "../../../store";
import { createRoomStock } from "../../api";

const useCreateRoomStock = () => {
    const { state, dispatch } = useContext(store);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRoomStock = (roomStock) => {
        dispatch({
            type: 'ADD_ROOM_STOCK',
            payload: roomStock,
        });
    };
    

    const createData = async (roomId, productId, quantity) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log(roomId, productId, quantity);
            const roomStock = await createRoomStock(roomId, productId, quantity);
            console.log(roomStock);
            handleRoomStock(roomStock);
            console.log(state.ui.roomStock);
            return roomStock;
        } catch (error) {
            console.error("Error creating room stock:", error);
            setError("Failed to create room stock. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return { createData,isLoading, error };
}

export default useCreateRoomStock;
