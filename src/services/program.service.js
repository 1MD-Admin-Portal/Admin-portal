// src/services/program.service.js

import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

// Common headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getProgramsService = async () => {
  try {
    const response = await api.get(CONSTANTS.URL.GET_PROGRAMS, {
      headers: getAuthHeaders(),
    });
    return response.data.programs;
  } catch (error) {
    console.error("Program fetch error:", error?.response?.data || error);
    throw error;
  }
};

export const createProgramService = async (programData) => {
  try {
    const response = await api.post(CONSTANTS.URL.CREATE_PROGRAM, programData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Create Program error:", error?.response?.data || error);
    throw error;
  }
};
export const uploadImageService = async (file) => {
  try {
    const formData = new FormData();
    formData.append("attachment", file); // use the key expected by backend

    const token = localStorage.getItem("token");
    const response = await api.post(CONSTANTS.URL.UPLOAD_MEDIA, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload response:", response.data);
    return response.data.url; // adjust if your backend returns differently
  } catch (error) {
    console.error("Image upload error:", error?.response?.data || error);
    throw error;
  }
};
