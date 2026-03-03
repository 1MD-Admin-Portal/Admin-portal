import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

/**
 * Get pending classes for approval.
 * Only returns classes that are pending status.
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 */
// Pending Classes (pagination support)
export const getPendingClassesService = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(
      `${CONSTANTS.URL.CLASS_PENDING}?page=${page}&limit=${limit}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // { classes: [...], pagination: {...} }
  } catch (error) {
    console.error("Pending classes fetch error:", error);
    throw error;
  }
};

// All Classes (pagination support)
export const getAllClassesService = async (page = 1, limit = 20) => {
  const token = localStorage.getItem("token");
  try {
    const res = await api.get(
      `${CONSTANTS.URL.GET_ALL_CLASSES}?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data; // { classes: [...], pagination: {...} }
  } catch (error) {
    console.error("Error fetching classes:", error);
    return { classes: [], pagination: {} };
  }
};

/**
 * Get only approved (ongoing) classes.
 * Supports pagination.
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 */
export const getOngoingClassesService = async (page = 1, limit = 10) => {
  try {
    const res = await api.get(
      `${CONSTANTS.URL.GET_ALL_CLASSES}?status=approved&page=${page}&limit=${limit}`
    );
    return res;
  } catch (error) {
    console.error("Error fetching ongoing classes:", error);
    throw error;
  }
};

/**
 * Get details of a specific class by ID.
 * @param {number|string} id - Class ID
 */
export const getClassDetailService = async (id) => {
  try {
    const response = await api.get(CONSTANTS.URL.CLASS_DETAIL(id), {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Class detail fetch error:", error);
    throw error;
  }
};

/**
 * Approve a class by ID with optional admin notes.
 * @param {number|string} id - Class ID
 * @param {string} adminNotes - Notes from admin
 */
export const approveClassService = async (id, adminNotes = "") => {
  try {
    const response = await api.put(
      CONSTANTS.URL.CLASS_APPROVE(id),
      { admin_notes: adminNotes },
      { headers: { "Content-Type": "application/json" } }
    );
    return response;
  } catch (error) {
    console.error("Class approve error:", error);
    throw error;
  }
};

/**
 * Reject a class by ID with optional admin notes.
 * @param {number|string} id - Class ID
 * @param {string} adminNotes - Notes from admin
 */
// rejectClassService.js
export const rejectClassService = async (id) => {
  const body = { rejection_reason: "Rejected by admin" }; // ✅ confirmed correct
  

  try {
    const response = await api.put(CONSTANTS.URL.CLASS_REJECT(id), body, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Class reject error:", error.response?.data || error.message);
    throw error;
  }
};
