import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

export const fetchUsers = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  try {
    const url = `${BASE_URL}/api/v1/admin/users?userType=user&page=${page}&limit=${limit}`;
    

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data; // { users: [...], pagination: {...} }
  } catch (error) {
    console.error("Error fetching Users:", error);
    return { users: [], pagination: {} };
  }
};

export const fetchUserBookedDates = async (userId, page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  try {
    const url = `${BASE_URL}${CONSTANTS.URL.USER_BOOKED_DATES(
      userId,
      page,
      limit
    )}`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error(`Error fetching booked dates for user ${userId}:`, error);
    return { user: {}, booked_dates: [], total_dates: 0, total_slots: 0 };
  }
};

// ==================== BADGE APIs ====================

export const fetchUserBadges = async (userId) => {
  const token = localStorage.getItem("token");

  try {
    const url = `${BASE_URL}${CONSTANTS.URL.GET_USER_BADGES(userId)}`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Response example:
    // {
    //   message,
    //   user_personas: [...],
    //   badges_by_persona: { persona: [ ... ] },
    //   next_badges: { persona: { ... } },
    //   total_badges
    // }
    return res.data;
  } catch (error) {
    console.error(`Error fetching badges for user ${userId}:`, error);
    return null;
  }
};

export const assignUserBadge = async ({
  target_user_id,
  user_type,
  badge_level,
  custom_commission_rate,
  reason,
}) => {
  const token = localStorage.getItem("token");

  const url = `${BASE_URL}${CONSTANTS.URL.ASSIGN_BADGE}`;

  // 🔹 Build payload exactly like backend example
  const payload = {
    target_user_id, // send as-is (string or number, backend decides)
    user_type, // "dancer" | "instructor" | "dj" | "organizer"
    badge_level: Number(badge_level), // force numeric
    reason: reason || "Badge updated via admin dashboard",
  };

  if (
    custom_commission_rate !== undefined &&
    custom_commission_rate !== null &&
    custom_commission_rate !== ""
  ) {
    payload.custom_commission_rate = Number(custom_commission_rate);
  }

  

  try {
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      "❌ Error assigning badge (response):",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchAllBadges = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${BASE_URL}/api/v1/admin/badges/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching all badges:", error);
    return null;
  }
};