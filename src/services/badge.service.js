import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

// 🔹 Get all badges (for BadgesPage, admin lists, dropdowns, etc.)
export const getAllBadgesService = async () => {
  const token = localStorage.getItem("token");

  try {
    const url = `${BASE_URL}${CONSTANTS.URL.GET_ALL_BADGES}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // adjust if your backend wraps it in { badges: [...] }
    return res.data;
  } catch (error) {
    console.error("Error fetching all badges:", error);
    throw error;
  }
};

// 🔹 Get badges for a specific user
export const getUserBadgesService = async (userId) => {
  const token = localStorage.getItem("token");

  try {
    const url = `${BASE_URL}${CONSTANTS.URL.GET_USER_BADGES(userId)}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data; // { message, user_personas, badges_by_persona, next_badges, total_badges, ... }
  } catch (error) {
    console.error(`Error fetching badges for user ${userId}:`, error);
    return null;
  }
};

// 🔹 Alias for new naming convention (used in dancers/professors pages)
export const fetchUserBadges = getUserBadgesService;

// 🔹 Assign / update a badge for a user
export const assignUserBadge = async ({
  target_user_id,
  user_type,
  badge_level,
  custom_commission_rate,
  reason,
}) => {
  const token = localStorage.getItem("token");

  const url = `${BASE_URL}${CONSTANTS.URL.ASSIGN_BADGE}`;

  const payload = {
    target_user_id, // number or string, as your backend uses
    user_type, // "dancer" | "instructor" | "dj" | "organizer"
    badge_level: Number(badge_level),
    reason: reason || "Badge updated via admin dashboard",
  };

  if (
    custom_commission_rate !== undefined &&
    custom_commission_rate !== null &&
    custom_commission_rate !== ""
  ) {
    payload.custom_commission_rate = Number(custom_commission_rate);
  }

  console.log("🔹 Assign badge payload:", payload);

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
