// services/upload.service.js
import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;
const UPLOAD_ENDPOINT = "/api/v1/file/upload"; // make sure this is correct

export const uploadMediaFile = async (file, metadata = {}) => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file); // or "media" if your backend expects that

    // Append extra fields
    if (metadata.title) formData.append("title", metadata.title);
    if (metadata.duration) formData.append("duration", metadata.duration);
    if (metadata.program_id) formData.append("program_id", metadata.program_id);

    const response = await axios.post(
      `${BASE_URL}${UPLOAD_ENDPOINT}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Media upload failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};
