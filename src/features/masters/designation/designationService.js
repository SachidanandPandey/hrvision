import apiClient from "../../../services/apiClient";

export const getDesignations = () => apiClient.get("/Designation");

export const createDesignation = (data) =>
  apiClient.post("/Designation", data);

export const updateDesignation = (id, data) =>
  apiClient.put(`/Designation/${id}`, data);

export const deleteDesignation = (id) =>
  apiClient.delete(`/Designation/${id}`);