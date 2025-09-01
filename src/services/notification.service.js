// src/services/notification.service.js

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

// Get all notifications with pagination
export const getNotificationsService = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(
      `${CONSTANTS.URL.GET_NOTIFICATIONS}?page=${page}&limit=${limit}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Get notifications error:", error?.response?.data || error);
    throw error;
  }
};

// Get notification details by ID
export const getNotificationDetailsService = async (id) => {
  try {
    const response = await api.get(CONSTANTS.URL.GET_NOTIFICATION_DETAILS(id), {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get notification details error:",
      error?.response?.data || error
    );
    throw error;
  }
};

// Create new notification
export const createNotificationService = async (notificationData) => {
  try {
    const response = await api.post(
      CONSTANTS.URL.CREATE_NOTIFICATION,
      notificationData,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Create notification error:", error?.response?.data || error);
    throw error;
  }
};

// Cancel notification
export const cancelNotificationService = async (id) => {
  try {
    const response = await api.delete(CONSTANTS.URL.CANCEL_NOTIFICATION(id), {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Cancel notification error:", error?.response?.data || error);
    throw error;
  }
};

// Upload image for notification
export const uploadNotificationImageService = async (file) => {
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
