// ===== EARNING.SERVICE.JS =====
import axios from "axios";
import { CONSTANTS } from "../utils/constants.js";

// ✅ Get Overview
export const getEarningsOverviewService = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.EARNINGS_OVERVIEW}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching earnings overview:",
      error.response?.data || error.message
    );
    return {};
  }
};

// ✅ Get All Earnings with filters + pagination
export const getAllEarningsService = async (
  page = 1,
  limit = 10,
  filters = {}
) => {
  try {
    const token = localStorage.getItem("token");

    // ✅ Build query string properly
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add filters only if they have values
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key].trim() !== "") {
        queryParams.append(key, filters[key]);
      }
    });

    const url = `${CONSTANTS.URL.BASE_URL}${
      CONSTANTS.URL.EARNINGS_ALL
    }?${queryParams.toString()}`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching all earnings:",
      error.response?.data || error.message
    );
    return { earnings: [], pagination: {} };
  }
};

// ✅ Get User Earnings Detail
export const getUserEarningsDetailService = async (userId, type) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.EARNINGS_USER_DETAIL(
        userId,
        type
      )}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching user earnings detail:",
      error.response?.data || error.message
    );
    return {};
  }
};
