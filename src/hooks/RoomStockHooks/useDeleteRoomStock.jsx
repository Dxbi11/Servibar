import { useEffect, useState, useContext } from "react";
import { store } from "../../../store";
import { deleteRoomStock } from "../../api";

const useDeleteRoomStock = (roomId, productId) => {
    const { state, dispatch } = useContext(store);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleRoomStock = (deletedRoomStockId) => {
        dispatch({
            type: 'DELETE_ROOM_STOCK',
            payload: { id: deletedRoomStockId },
        });
    };

    const deleteData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteRoomStock(roomId, productId);
            handleRoomStock(roomId); // Assuming productId is the unique identifier
        } catch (error) {
            console.error("Error deleting data:", error);
            setError("Failed to delete room stock. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (roomId && productId) {
            deleteData();
        }
    }, [roomId, productId]);

    return { isLoading, error };
}

export default useDeleteRoomStock;
