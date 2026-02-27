// services/upload.service.js
import { CONSTANTS } from "../utils/constants";
import api from "../api/api"; // ✅ your axios instance

export const uploadMediaFile = async (file) => {
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

    // ✅ use fileURL returned by backend
    return response.data?.uploadResponse?.fileURL || null;
  } catch (error) {
    console.error("❌ Media upload error:", error?.response?.data || error);
    throw error;
  }
};
