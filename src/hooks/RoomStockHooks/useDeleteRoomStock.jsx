import { useState, useContext, useCallback } from "react";
import { store } from "../../../store";
import { deleteRoomStock } from "../../api";
const useDeleteRoomStock = () => {
    const { dispatch } = useContext(store);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRoomStock = useCallback((deletedRoomStockId) => {
        console.log(deletedRoomStockId);
        dispatch({
            type: 'DELETE_ROOM_STOCK',
            payload: { id: deletedRoomStockId },
        });
    }, [dispatch]);

    const deleteData = useCallback(async (roomId, productId, stockId) => {
        setIsLoading(true);
        setError(null);

        try {
            await deleteRoomStock(roomId, productId);
            handleRoomStock(stockId);
        } catch (error) {
            console.error("Error deleting data:", error);
            setError("Failed to delete room stock. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [handleRoomStock]);

    return { deleteData, isLoading, error };
}

export default useDeleteRoomStock;
