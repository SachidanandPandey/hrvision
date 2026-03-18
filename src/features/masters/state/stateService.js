import apiClient from "../../../services/apiClient";

export const getStates = () => apiClient.get("/State");

export const getCountries = () => apiClient.get("/Country");

export const createState = (data) =>
  apiClient.post("/State", data);

export const updateState = (id, data) =>
  apiClient.put(`/State/${id}`, data);

export const deleteState = (id) =>
  apiClient.delete(`/State/${id}`);


/*import axios from "axios";

const API_BASE = "https://localhost:7074/api";

export const getStates = () => axios.get(`${API_BASE}/State`);

export const getCountries = () => axios.get(`${API_BASE}/Country`);

export const createState = (data) =>
  axios.post(`${API_BASE}/State`, data);

export const updateState = (id, data) =>
  axios.put(`${API_BASE}/State/${id}`, data);

export const deleteState = (id) =>
  axios.delete(`${API_BASE}/State/${id}`);*/