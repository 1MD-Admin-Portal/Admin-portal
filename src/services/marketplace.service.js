import axios from "axios";
import { CONSTANTS } from "../utils/constants.js";

const getToken = () => localStorage.getItem("token");

// Fetch marketplace programs
export const getMarketplacePrograms = async (page = 1, limit = 10, search = "") => {
  try {
    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}/api/v1/admin/marketplace-programs?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching marketplace programs:", error);
    return { programs: [], pagination: {} };
  }
};

// Fetch purchases for a specific program
export const getProgramPurchases = async (programId, page = 1, limit = 10) => {
  try {
    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}/api/v1/admin/programs/${programId}/purchases?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      `❌ Error fetching purchases for program ${programId}:`,
      error
    );
    return { purchases: [], pagination: {}, statistics: {} };
  }
};

// Fetch published events
export const getPublishedEvents = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}/api/v1/admin/events?status=published&page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching published events:", error);
    return { events: [], pagination: {} };
  }
};
