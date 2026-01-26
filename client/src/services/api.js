import axios from 'axios';

// Use relative paths for both local dev and production
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

// Medium API calls
export const getMediums = async () => {
  const response = await axios.get(`${API_BASE_URL}/mediums`);
  return response.data;
};

export const getMedium = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/mediums/${id}`);
  return response.data;
};

export const createMedium = async (mediumData) => {
  const response = await axios.post(`${API_BASE_URL}/mediums`, mediumData);
  return response.data;
};

export const updateMedium = async (id, mediumData) => {
  const response = await axios.patch(`${API_BASE_URL}/mediums/${id}`, mediumData);
  return response.data;
};

export const deleteMedium = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/mediums/${id}`);
  return response.data;
};

// Item API calls
export const getItems = async () => {
  const response = await axios.get(`${API_BASE_URL}/items`);
  return response.data;
};

export const getItemsByMedium = async (mediumId) => {
  const response = await axios.get(`${API_BASE_URL}/items/medium/${mediumId}`);
  return response.data;
};

export const getItem = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/items/${id}`);
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await axios.post(`${API_BASE_URL}/items`, itemData);
  return response.data;
};

export const updateItem = async (id, itemData) => {
  const response = await axios.patch(`${API_BASE_URL}/items/${id}`, itemData);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/items/${id}`);
  return response.data;
};

// Wishlist API calls
export const getWishlistItems = async () => {
  const response = await axios.get(`${API_BASE_URL}/items/wishlist/all`);
  return response.data;
};

export const getWishlistItemsByMedium = async (mediumId) => {
  const response = await axios.get(`${API_BASE_URL}/items/wishlist/medium/${mediumId}`);
  return response.data;
};

export const toggleWishlist = async (id, isWishlist) => {
  const response = await axios.patch(`${API_BASE_URL}/items/${id}`, { isWishlist });
  return response.data;
};

// Consumed API calls
export const getConsumedItems = async () => {
  const response = await axios.get(`${API_BASE_URL}/items/consumed/all`);
  return response.data;
};

export const getConsumedItemsByMedium = async (mediumId) => {
  const response = await axios.get(`${API_BASE_URL}/items/consumed/medium/${mediumId}`);
  return response.data;
};

export const toggleConsumed = async (id, isConsumed) => {
  const response = await axios.patch(`${API_BASE_URL}/items/${id}`, { isConsumed });
  return response.data;
};

// In Progress API calls
export const getInProgressItems = async () => {
  const response = await axios.get(`${API_BASE_URL}/items/inprogress/all`);
  return response.data;
};

export const getInProgressItemsByMedium = async (mediumId) => {
  const response = await axios.get(`${API_BASE_URL}/items/inprogress/medium/${mediumId}`);
  return response.data;
};

export const toggleInProgress = async (id, isInProgress) => {
  const response = await axios.patch(`${API_BASE_URL}/items/${id}`, { isInProgress });
  return response.data;
};

// Search API calls
export const searchMediums = async (query, filters = {}) => {
  const params = new URLSearchParams();
  params.append('query', query);
  
  if (filters.ratingMin !== undefined) params.append('ratingMin', filters.ratingMin);
  if (filters.ratingMax !== undefined) params.append('ratingMax', filters.ratingMax);
  if (filters.dateFilter) params.append('dateFilter', filters.dateFilter);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);

  const response = await axios.get(`${API_BASE_URL}/mediums/search?${params.toString()}`);
  return response.data;
};

export const searchItems = async (query, filters = {}) => {
  const params = new URLSearchParams();
  params.append('query', query);
  
  if (filters.ratingMin !== undefined) params.append('ratingMin', filters.ratingMin);
  if (filters.ratingMax !== undefined) params.append('ratingMax', filters.ratingMax);
  if (filters.dateFilter) params.append('dateFilter', filters.dateFilter);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);

  const response = await axios.get(`${API_BASE_URL}/items/search?${params.toString()}`);
  return response.data;
};