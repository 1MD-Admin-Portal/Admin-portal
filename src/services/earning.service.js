// ===== EARNING.SERVICE.JS =====
import axios from "axios";
import { CONSTANTS } from "../utils/constants.js";

const getToken = () => localStorage.getItem("token");
const baseURL = CONSTANTS.URL.BASE_URL;

// ✅ Get Overview
export const getEarningsOverviewService = async () => {
  try {
    const res = await axios.get(
      `${baseURL}${CONSTANTS.URL.EARNINGS_OVERVIEW}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching earnings overview:", error.response?.data || error.message);
    return {};
  }
};

// ✅ Get All Earnings with filters + pagination
export const getAllEarningsService = async (page = 1, limit = 10, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key].trim() !== "") {
        queryParams.append(key, filters[key]);
      }
    });
    const url = `${baseURL}${CONSTANTS.URL.EARNINGS_ALL}?${queryParams.toString()}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching all earnings:", error.response?.data || error.message);
    return { earnings: [], pagination: {} };
  }
};

// ✅ Get User Earnings Detail
export const getUserEarningsDetailService = async (userId, type) => {
  try {
    const res = await axios.get(
      `${baseURL}${CONSTANTS.URL.EARNINGS_USER_DETAIL(userId, type)}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching user earnings detail:", error.response?.data || error.message);
    return {};
  }
};

// ===== DISPUTES =====

// ✅ GET /api/v1/admin/earnings/disputes/open
export const getOpenDisputesService = async () => {
  try {
    const res = await axios.get(
      `${baseURL}/api/v1/admin/earnings/disputes/open`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching open disputes:", error.response?.data || error.message);
    return { disputes: [] };
  }
};

// ✅ PUT /api/v1/admin/earnings/disputes/:disputeId/resolve
// Body: { admin_response, resolution_notes }
export const resolveDisputeService = async (disputeId, payload) => {
  try {
    const res = await axios.put(
      `${baseURL}/api/v1/admin/earnings/disputes/${disputeId}/resolve`,
      payload,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error resolving dispute:", error.response?.data || error.message);
    throw error;
  }
};