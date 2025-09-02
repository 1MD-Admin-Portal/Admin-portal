import axios from "axios";
import { CONSTANTS } from "../utils/constants.js";

// ✅ Get all badges
export const getAllBadgesService = async () => {
  try {
    const token = localStorage.getItem("token");
    const url = `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.GET_ALL_BADGES()}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching all badges:",
      error.response?.data || error.message
    );
    return { badges: [] };
  }
};

// ✅ Get user-specific badges
export const getUserBadgesService = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const url = `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.GET_USER_BADGES(
      userId
    )}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching user badges:",
      error.response?.data || error.message
    );
    return {
      user_personas: [],
      badges_by_persona: {},
      next_badges: {},
      total_badges: 0,
    };
  }
};
