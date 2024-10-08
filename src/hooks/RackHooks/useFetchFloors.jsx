import { useEffect, useContext } from "react";
import { getFloorsbyHotelId } from "../../api";
import { store } from "../../../store";

const useFetchFloors = (HotelId) => {
    const { dispatch } = useContext(store);
    const handleFloors = (floors) => {
        dispatch({ type: "SET_FLOORS", payload: floors });
    };
    
    const fetchData = async () => {
        try {
            const data = await getFloorsbyHotelId(HotelId);
            handleFloors(data);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        if (HotelId) {
            fetchData();
        }
    }, [HotelId]);
}

export default useFetchFloors;