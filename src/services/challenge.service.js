import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

/**
 * Fetch challenges with pagination and optional filters.
 * @param {Object} params - { page, limit, search, status, duration, participants }
 */
export const getChallengesService = async (params = {}) => {
  try {
    const response = await api.get(CONSTANTS.URL.GET_CHALLENGES, {
      headers: {
        "Content-Type": "application/json",
      },
      params, // query parameters passed here
    });
    return response;
  } catch (error) {
    console.error("Challenge fetch error:", error);
    throw error;
  }
};

export const createChallengeService = async (data) => {
  try {
    const response = await api.post(CONSTANTS.URL.CHALLENGE_CREATE, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Challenge creation error:", error);
    throw error;
  }
};
// src/services/challenge.service.js

export const uploadChallengeMediaService = async (file) => {
  try {
    const formData = new FormData();
    formData.append("attachment", file);

    const token = localStorage.getItem("token");

    const response = await api.post(CONSTANTS.URL.UPLOAD_MEDIA, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload API response:", response.data);
    return response.data.uploadResponse.fileURL; // ✅ updated key
  } catch (error) {
    console.error(
      "Challenge media upload error:",
      error?.response?.data || error
    );
    throw error;
  }
};
