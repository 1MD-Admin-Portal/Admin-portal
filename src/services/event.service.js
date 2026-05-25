import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

/**
 * Fetch all draft events
 * @param {object} params - Optional query params (pagination, filters, etc.)
 */
export const getAllDraftEventsService = async (params = {}) => {
  try {
    const response = await api.get(CONSTANTS.URL.GET_ALL_EVENTS_DRAFT, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch draft events:", error);
    throw error;
  }
};

/**
 * Fetch all approved events
 * @param {object} params - Optional query params (pagination, filters, etc.)
 */
export const getAllApprovedEventsService = async (params = {}) => {
  try {
    const response = await api.get(CONSTANTS.URL.GET_ALL_EVENTS_APPROVED, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch approved events:", error);
    throw error;
  }
};

/**
 * Get interested users for a specific event.
 */
export const getEventInterestsService = async (eventId, params = {}) => {
  try {
    const response = await api.get(CONSTANTS.URL.GET_EVENT_INTERESTS(eventId), {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch event interests:", error);
    throw error;
  }
};

/**
 * Approve an event with optional admin notes.
 */
export const approveEventService = async (eventId, adminNotes = "") => {
  try {
    const response = await api.put(
      CONSTANTS.URL.APPROVE_EVENT(eventId),
      { admin_notes: adminNotes },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Failed to approve event:", error);
    throw error;
  }
};

/**
 * Reject an event with a default admin reason if none provided.
 */
export const rejectEventService = async (
  eventId,
  adminNotes = "Rejected by Admin"
) => {
  try {
    const body = { admin_notes: adminNotes };
    
    const response = await api.put(CONSTANTS.URL.REJECT_EVENT(eventId), body, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Failed to reject event:",
      error.response?.data || error.message
    );
    throw error;
  }
};
