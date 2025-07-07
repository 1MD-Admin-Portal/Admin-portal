import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL; // ✅ change this to your backend base URL
const api = axios.create({
  baseURL: BASE_URL, // ✅ change this to your backend base URL
});

// function setToken() {
//   api.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
// }


// Optional: Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
