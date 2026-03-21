import apiClient from "../../../services/apiClient";

export const getCities = () => apiClient.get("/City");

export const getStates = () => apiClient.get("/State");

export const createCity = (data) =>
  apiClient.post("/City", data);

export const updateCity = (id, data) =>
  apiClient.put(`/City/${id}`, data);

export const deleteCity = (id) =>
  apiClient.delete(`/City/${id}`);