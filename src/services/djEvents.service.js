import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

// ✅ Get all DJ events with filters
export const getAllDjEvents = async (
  status = "",
  playlist_type = "",
  search = "",
  page = 1,
  limit = 20
) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(
      `${BASE_URL}${CONSTANTS.URL.DJ_EVENTS.GET_ALL(
        status,
        playlist_type,
        search,
        page,
        limit
      )}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching DJ events:", error);
    throw error;
  }
};

// ✅ Get DJ event by ID
export const getDjEventById = async (eventId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(
      `${BASE_URL}${CONSTANTS.URL.DJ_EVENTS.GET_BY_ID(eventId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching DJ event details:", error);
    throw error;
  }
};

// ✅ Approve DJ event
export const approveDjEvent = async (eventId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.put(
      `${BASE_URL}${CONSTANTS.URL.DJ_EVENTS.APPROVE(eventId)}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error approving DJ event:", error);
    throw error;
  }
};

// ✅ Reject DJ event
export const rejectDjEvent = async (eventId, admin_notes = "") => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.put(
      `${BASE_URL}${CONSTANTS.URL.DJ_EVENTS.REJECT(eventId)}`,
      { admin_notes },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error rejecting DJ event:", error);
    throw error;
  }
};

// ✅ Get pending DJ events
export const getPendingDjEvents = async (page = 1, limit = 20) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(
      `${BASE_URL}${CONSTANTS.URL.DJ_EVENTS.GET_PENDING}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching pending DJ events:", error);
    throw error;
  }
};

// ✅ Get DJ events statistics
export const getDjEventsStatistics = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(
      `${BASE_URL}${CONSTANTS.URL.DJ_EVENTS.GET_STATISTICS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching DJ events statistics:", error);
    throw error;
  }
};
