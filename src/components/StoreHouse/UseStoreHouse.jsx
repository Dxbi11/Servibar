import React, {useEffect, useState, useContext} from "react";
import { store } from "../../../store";
import { getProductsByHotelId } from "../../api";
// getStoreHouse, postStoreHouse,
const UseStoreHouse = ( ) => {
    const { state, dispatch } = useContext(store);
    const HotelId = state.ui.hotelId;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (HotelId) {
            async function fetchProducts() {
                try {
                    const productsData = await getProductsByHotelId(HotelId);
                    setProducts(productsData);
                } catch (error) {
                    console.error("Error fetching products:", error);
                }
            }
            fetchProducts();
        }

    }, [HotelId]);
  return products;
};

export default UseStoreHouse;


// ! Implementar insertar los productos a la tabla StoreHouse, cambio requerido en Prisma.
// const SetStoreHouse = () => {
//     const products = UseStoreHouse();

//     useEffect(() => {
        
// }