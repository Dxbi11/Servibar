import { useContext, useState } from "react";
import { store } from "../../../store";
import { updateRoom } from "../../api";

const useUpdateRoomData = () => {
    const { state, dispatch } = useContext(store);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateRoomData = async (room, updatedData) => {
        console.log("Room data to update:", updatedData);
        try {
            // Llamamos a la API para actualizar los datos del cuarto
            const updatedRoom = await updateRoom(room.id, updatedData);

            // Actualizamos el store solo después de la respuesta exitosa

            console.log("Room updated successfully:", updatedRoom);
        } catch (error) {
            console.error("Error updating room dataaa:", error);
            setError("Failed to update room. Please try again.");
        } finally {
            setLoading(false); // Terminamos el estado de carga
        }
    };

    return { updateRoomData, loading, error };
};

export default useUpdateRoomData;
