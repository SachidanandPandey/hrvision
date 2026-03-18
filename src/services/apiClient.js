import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7074/api",
  timeout: 10000,
});

export default apiClient;