import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * Get all studios with pagination and filters
 * @param {number} page - Page number (default: 1)
 * @param {string} search - Search query (optional)
 * @param {string} city - Filter by city (optional)
 * @param {string} state - Filter by state (optional)
 * @param {string} country - Filter by country (optional)
 * @returns {Promise}
 */
export const getStudios = async (page = 1, search = "", city = "", state = "", country = "") => {
  try {
    const res = await axios.get(
      `${BASE_URL}${CONSTANTS.URL.STUDIOS.GET_ALL(page, search, city, state, country)}`,
      {
        headers: getHeaders(),
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching studios:", error);
    throw error;
  }
};

/**
 * Get studio details by ID
 * @param {string} studioId - Studio ID
 * @returns {Promise}
 */
export const getStudioById = async (studioId) => {
  try {
    const res = await axios.get(
      `${BASE_URL}${CONSTANTS.URL.STUDIOS.GET_BY_ID(studioId)}`,
      {
        headers: getHeaders(),
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching studio details:", error);
    throw error;
  }
};

/**
 * Create a new studio
 * @param {object} studioData - Studio data
 * @returns {Promise}
 */
export const createStudio = async (studioData) => {
  try {
    const res = await axios.post(
      `${BASE_URL}${CONSTANTS.URL.STUDIOS.CREATE}`,
      studioData,
      {
        headers: getHeaders(),
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating studio:", error);
    console.error("Response data:", error.response?.data);
    throw error;
  }
};

/**
 * Update studio details
 * @param {string} studioId - Studio ID
 * @param {object} studioData - Updated studio data
 * @returns {Promise}
 */
export const updateStudio = async (studioId, studioData) => {
  try {
    
    const res = await axios.put(
      `${BASE_URL}${CONSTANTS.URL.STUDIOS.UPDATE(studioId)}`,
      studioData,
      {
        headers: getHeaders(),
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating studio:", error);
    console.error("Response data:", error.response?.data);
    throw error;
  }
};

/**
 * Delete a studio
 * @param {string} studioId - Studio ID
 * @returns {Promise}
 */
export const deleteStudio = async (studioId) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}${CONSTANTS.URL.STUDIOS.DELETE(studioId)}`,
      {
        headers: getHeaders(),
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting studio:", error);
    throw error;
  }
};

/**
 * Get studio statistics
 * @returns {Promise}
 */
export const getStudioStatistics = async () => {
  try {
    const res = await axios.get(
      `${BASE_URL}${CONSTANTS.URL.STUDIOS.GET_STATISTICS}`,
      {
        headers: getHeaders(),
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching studio statistics:", error);
    throw error;
  }
};

/**
 * Link instructor to studio
 * @param {object} linkData - Link data containing studioId and instructorId
 * @returns {Promise}
 */
export const linkInstructorToStudio = async (linkData) => {
  try {
    const res = await axios.post(
      `${BASE_URL}${CONSTANTS.URL.STUDIOS.LINK_INSTRUCTOR}`,
      linkData,
      {
        headers: getHeaders(),
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error linking instructor to studio:", error);
    throw error;
  }
};

/**
 * Unlink instructor from studio
 * @param {string} linkId - Link ID
 * @returns {Promise}
 */
export const unlinkInstructor = async (linkId) => {
  try {
    const res = await axios.delete(
      `${BASE_URL}${CONSTANTS.URL.STUDIOS.UNLINK_INSTRUCTOR(linkId)}`,
      {
        headers: getHeaders(),
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error unlinking instructor from studio:", error);
    throw error;
  }
};
