// src/api.js

import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Replace with your backend URL

const api = axios.create({
  baseURL: API_URL,
});

export const getAllHotels = async () => {
  const response = await api.get('/hotels');
  return response.data;
};

export const createHotel = async (hotelData) => {
  const response = await api.post('/hotels', hotelData);
  return response.data;
};

export const deleteHotel = async (hotelId) => {
  await api.delete(`/hotels/${hotelId}`);
};
