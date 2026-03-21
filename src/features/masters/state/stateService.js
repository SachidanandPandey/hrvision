import apiClient from "../../../services/apiClient";

export const getStates = () => apiClient.get("/State");

export const getCountries = () => apiClient.get("/Country");

export const createState = (data) =>
  apiClient.post("/State", data);

export const updateState = (id, data) =>
  apiClient.put(`/State/${id}`, data);

export const deleteState = (id) =>
  apiClient.delete(`/State/${id}`);

