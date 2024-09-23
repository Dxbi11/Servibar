import { useEffect, useState, useContext } from "react";
import { store } from "../../../store";
import { getRoomsByHotelId } from "../../api";

const useFetchRooms = (floorId) => {
    console.log(floorId);
    const { state, dispatch } = useContext(store);
    const HotelId = state.ui.hotelId;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleRooms = (rooms) => {
        dispatch({ type: "SET_ROOMS", payload: rooms });
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const roomsData = await getRoomsByHotelId(HotelId);
            const filteredRooms = roomsData.filter(room => room.floorId == floorId);
            handleRooms(filteredRooms);
            
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load room data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (HotelId && floorId) {
            fetchData();
        }
    }, [HotelId, floorId]);

    return { isLoading, error };
}

export default useFetchRooms;