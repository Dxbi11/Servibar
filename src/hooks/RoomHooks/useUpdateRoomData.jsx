import { useContext } from "react";
import { store } from "../../../store";
import { updateRoom } from "../../api";

const useUpdateRoomData = () => {
    const { state, dispatch } = useContext(store);

    const updateRoomData = async (roomId, updatedData) => {
        try {
            console.log(updatedData);
            const updatedRoom = await updateRoom(roomId, updatedData);
            dispatch({ type: "UPDATE_ROOM", payload: updatedRoom });
            console.log(updatedRoom);   
        } catch (error) {
            console.error("Error updating room data:", error);
        }
    };

    return updateRoomData;
}

export default useUpdateRoomData;