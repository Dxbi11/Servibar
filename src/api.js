// src/api.js
// src/api.js

import axios from 'axios';

const API_URL = 'https://servibarex.fly.dev'; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
});

// Hotel operations
export const getAllHotels = async () => {
  const response = await api.get('/hotels');
  return response.data;
};

export const getHotelById = async (hotelId) => {
  const response = await api.get(`/hotels/${hotelId}`);
  return response.data;
};

export const createHotel = async (hotelData) => {
  const response = await api.post('/hotels', hotelData);
  return response.data;
};

export const updateHotel = async (hotelId, hotelData) => {
  const response = await api.put(`/hotels/${hotelId}`, hotelData);
  return response.data;
};

export const deleteHotel = async (hotelId) => {
  await api.delete(`/hotels/${hotelId}`);
};

// Floor operations
export const getAllFloors = async () => {
  const response = await api.get('/floors');
  return response.data;
};

export const getFloorById = async (floorId) => {
  const response = await api.get(`/floors/${floorId}`);
  return response.data;
};

export const getFloorsbyHotelId = async (hotelId) => {
  const response = await api.get(`/hotels/${hotelId}/floors`);
  return response.data;
};

export const createFloor = async (floorData) => {
    console.log('Attempting to create floor with data:', floorData);
    try {
      const response = await api.post('/floors', floorData);
      console.log('Floor created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating floor:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

export const updateFloor = async (floorId, floorData) => {
  const response = await api.put(`/floors/${floorId}`, floorData);
  return response.data;
};

export const deleteFloor = async (floorId) => {
  await api.delete(`/floors/${floorId}`);
};

// Room operations
export const getAllRooms = async () => {
  const response = await api.get('/rooms');
  return response.data;
};

export const getRoomsByHotelId = async (hotelId) => {
  const response = await api.get(`/rooms/${hotelId}`);
  return response.data;
};

export const getRoomById = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data;
};

export const createRoom = async (roomData) => {
  const response = await api.post('/rooms', roomData);
  return response.data;
};

export const updateRoom = async (roomId, roomData) => {
  const response = await api.put(`/rooms/${roomId}`, roomData);
  return response.data;
};

export const deleteRoom = async (roomId) => {
  await api.delete(`/rooms/${roomId}`);
};

// Product operations
export const getAllProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductsByHotelId = async (hotelId) => {
  const response = await api.get(`/hotels/${hotelId}/products`);
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  await api.delete(`/products/${productId}`);
};

// RoomStock operations
export const getAllRoomStock = async () => {
  const response = await api.get('/roomstocks');
  return response.data;
};

export const getRoomStock = async (roomId) => {
  const response = await api.get(`/roomstocks/${roomId}`);
  return response.data;
};

export const createRoomStock = async (roomId, productId, quantity) => {
  try {
    console.log(roomId, productId, quantity);
    const response = await api.post(`/roomstocks/${roomId}`, { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Failed to create room stock:', error);
    throw error;
  }
};

export const deleteRoomStock = async (roomId, productId) => {
  try {
    await api.delete(`/roomstocks/${roomId}/${productId}`);
  } catch (error) {
    console.error('Failed to delete room stock:', error);
    throw error;
  }
};


export const updateRoomStock = async (roomId, productId, quantity) => {
  try {
    const response = await api.put(`/roomstocks/${roomId}/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Failed to update room stock:', error);
    throw error;
  }
};

// Invoice operations
export const getAllInvoices = async () => {
  const response = await api.get('/invoices');
  return response.data;
};

export const getInvoicesByHotelId = async (hotelId, startDate) => {
  const response = await api.get(`/invoices/hotel/${hotelId}`, {
    params: { startDate }
  });
  return response.data;
};

export const getInvoiceById = async (invoiceId) => {
  const response = await api.get(`/invoices/${invoiceId}`);
  return response.data;
};

export const createInvoice = async (invoiceData) => {
  const response = await api.post('/invoices', invoiceData);
  return response.data;
};

export const updateInvoice = async (invoiceId, invoiceData) => {
  const response = await api.put(`/invoices/${invoiceId}`, invoiceData);
  return response.data;
};

export const deleteInvoice = async (invoiceId) => {
  await api.delete(`/invoices/${invoiceId}`);
};

// InvoiceItem operations
export const addInvoiceItem = async (invoiceId, itemData) => {
  const response = await api.post(`/invoices/${invoiceId}/items`, itemData);
  return response.data;
};

export const updateInvoiceItem = async (invoiceId, itemId, itemData) => {
  const response = await api.put(`/invoices/${invoiceId}/items/${itemId}`, itemData);
  return response.data;
};

export const deleteInvoiceItem = async (invoiceId, itemId) => {
  await api.delete(`/invoices/${invoiceId}/items/${itemId}`);
};
// StoreHouse operations

// Get all storehouse entries
export const getAllStoreHouses = async () => {
  const response = await api.get('/storehouse');
  return response.data;
};

export const postStoreHouse = async (storeHouseData) => {
  const response = await api.post('/storehouse', storeHouseData);
}
// Get storehouse entries by hotelId
export const getStoreHouseByHotelId = async (hotelId) => {
  try {
    const response = await api.get(`/storehouse/${hotelId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching storehouse for hotelId ${hotelId}:`, error);
    throw error;
  }
};


// Get storehouse entry by ID
export const getStoreHouseById = async (storeHouseId) => {
  const response = await api.get(`/storehouse/${storeHouseId}`);
  return response.data;
};

// Create a new storehouse entry
export const createStoreHouse = async (storeHouseData) => {
  try {
    const response = await api.post('/storehouse', storeHouseData);
    return response.data;
  } catch (error) {
    console.error('Failed to create storehouse entry:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Update an existing storehouse entry
export const updateStoreHouse = async (storeHouseId, storeHouseData) => {
  try {
    const response = await api.put(`/storehouse/${storeHouseId}`, storeHouseData);
    return response.data;
  } catch (error) {
    console.error('Failed to update storehouse entry:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Delete a storehouse entry
export const deleteStoreHouse = async (storeHouseId) => {
  try {
    await api.delete(`/storehouse/${storeHouseId}`);
  } catch (error) {
    console.error('Failed to delete storehouse entry:', error.response ? error.response.data : error.message);
    throw error;
  }
};

