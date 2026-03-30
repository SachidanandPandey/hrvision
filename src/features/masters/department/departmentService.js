import apiClient from "../../../services/apiClient";

export const getDepartments = () => apiClient.get("/Department");

export const createDepartment = (data) =>
  apiClient.post("/Department", data);

export const updateDepartment = (id, data) =>
  apiClient.put(`/Department/${id}`, data);

export const deleteDepartment = (id) =>
  apiClient.delete(`/Department/${id}`);