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
    return response.data.url; // adjust if your backend returns differently
  } catch (error) {
    console.error("Image upload error:", error?.response?.data || error);
    throw error;
  }
};

// === NEW PENDING PROGRAMS APIs ===

export const getPendingProgramsService = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(
      `${CONSTANTS.URL.GET_PENDING_PROGRAMS}?page=${page}&limit=${limit}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Pending programs fetch error:",
      error?.response?.data || error
    );
    throw error;
  }
};

export const approveProgramService = async (programId, adminNotes) => {
  try {
    const response = await api.post(
      `${CONSTANTS.URL.APPROVE_PROGRAM}/${programId}/approve`,
      { admin_notes: adminNotes },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Program approval error:", error?.response?.data || error);
    throw error;
  }
};

export const rejectProgramService = async (programId, rejectionReason) => {
  try {
    const response = await api.post(
      `${CONSTANTS.URL.REJECT_PROGRAM}/${programId}/reject`,
      { rejection_reason: rejectionReason },
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Program rejection error:", error?.response?.data || error);
    throw error;
  }
};
