import { useContext } from "react";
import { store } from "../../../store";
import { updateStoreHouse } from "../../api";

const useUpdateStoreHouseData = () => {
    const { state, dispatch } = useContext(store);

    const updateStoreHouseData = async (StoreHouseId, updatedData) => {
        try {
            const updatedStoreHouse = await updateStoreHouse(StoreHouseId, updatedData);
            dispatch({ type: "UPDATE_STORE_HOUSE", payload: updatedStoreHouse });
        } catch (error) {
            console.error("Error updating room data:", error);
        }
    };

    return updateStoreHouseData;
}

export default useUpdateStoreHouseData;