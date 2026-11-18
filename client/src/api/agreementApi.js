import axios from 'axios';

// Vite proxy forwards /api to backend server (localhost:5000)
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Fetch all agreements with optional filters (search, status)
 */
export const getAgreements = async (params = {}) => {
  const response = await api.get('/agreements', { params });
  return response.data;
};

/**
 * Fetch agreement statistics for dashboard
 */
export const getAgreementStats = async () => {
  const response = await api.get('/agreements/stats/summary');
  return response.data;
};

/**
 * Fetch a specific agreement by ID (MongoDB _id or custom agreementId)
 */
export const getAgreementById = async (id) => {
  const response = await api.get(`/agreements/${id}`);
  return response.data;
};

/**
 * Create a new digital agreement
 */
export const createAgreement = async (agreementData) => {
  const response = await api.post('/agreements', agreementData);
  return response.data;
};

/**
 * Update an agreement (e.g. status transition, detail update)
 */
export const updateAgreement = async (id, updateData) => {
  const response = await api.put(`/agreements/${id}`, updateData);
  return response.data;
};

/**
 * Check backend and database health
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
