// src/api.js
// src/api.js

import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Replace with your backend URL

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
export const getRoomStock = async (roomId) => {
  const response = await api.get(`/roomstocks/${roomId}`);
  return response.data;
};

export const updateRoomStock = async (roomId, productId, quantity) => {
    try {
      const response = await api.put(`/roomstocks/${roomId}/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      // Handle error, e.g., log it or throw a custom error
      console.error('Failed to update room stock:', error);
      throw error; // Optionally re-throw or handle differently
    }
  };

// Invoice operations
export const getAllInvoices = async () => {
  const response = await api.get('/invoices');
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