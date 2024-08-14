import { useEffect, useContext } from "react";
import { store } from "../../../store";
import { getAllHotels } from "../../api";

const useFetchHotels = () => {
    const { state, dispatch } = useContext(store);
    const HotelId = state.ui.hotelId;
    
    const handleHotels = (hotels) => {
        dispatch({ type: "SET_HOTELS", payload: hotels });
    };
    
    const fetchData = async () => {
        try {
        const data = await getAllHotels();
        handleHotels(data);
        } catch (error) {
        console.error(error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [HotelId]);
    }

export default useFetchHotels;