import React, {useEffect, useState} from "react";
import { getAllProducts } from "../../api";
// getStoreHouse, postStoreHouse,
const UseStoreHouse = () => {
    const [products, setProducts] = useState([]);



    useEffect(() => {
        async function fetchProducts() {
            try {
                const productsData = await getAllProducts();
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }

        fetchProducts();
    }, []);


    /* 
    useEffect(() => {
        async function fetchStoreHouse() {
            try {
                const storeHouseData = await getStoreHouse();
                
            } catch (error) {
                console.error("Error fetching store house:", error);
            }
        }

        fetchStoreHouse();
    }, []);

    useEffect(() => {
        async function addStoreHouse() {
            try {
                const storeHouseData = await postStoreHouse(products);
                
            } catch (error) {
                console.error("Error adding store house:", error);
            }
        }

        addStoreHouse();
    }
    , []);
    */
  return products;
};

export default UseStoreHouse;