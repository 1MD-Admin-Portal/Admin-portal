import axios from "./api";

export const login = async (email, password) => {
  return axios.post("/auth/login", { email, password });
};

export const forgotPassword = async (email) => {
  return axios.post("/auth/forgot-password", { email });
};
