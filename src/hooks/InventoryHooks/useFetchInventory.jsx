import React, {useEffect, useState, useContext} from "react";
import { store } from "../../../store";
import { getProductsByHotelId } from "../../api";

const useFetchInventory = ( ) => {
    const { state, dispatch } = useContext(store);
    const HotelId = state.ui.hotelId;

    const handleProducts = (products) => {
        dispatch({ type: 'SET_PRODUCTS', payload: products });
    }
    

    useEffect(() => {
        if (HotelId) {
            async function fetchProducts() {
                try {
                    const productsData = await getProductsByHotelId(HotelId);
                    handleProducts(productsData);
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            }
            fetchProducts();
        }

    }, [HotelId]);
};

export default useFetchInventory;