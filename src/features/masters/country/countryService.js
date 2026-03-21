import apiClient from "../../../services/apiClient";

export const getCountries = () => apiClient.get("/Country");

export const createCountry = (data) =>
  apiClient.post("/Country", data);

export const updateCountry = (id, data) =>
  apiClient.put(`/Country/${id}`, data);

export const deleteCountry = (id) =>
  apiClient.delete(`/Country/${id}`);