// import axios from "axios";
// import { CONSTANTS } from "../utils/constants.js";

// // ✅ Get all badges
// export const getAllBadgesService = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const url = `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.GET_ALL_BADGES()}`;
//     const res = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     console.error(
//       "❌ Error fetching all badges:",
//       error.response?.data || error.message
//     );
//     return { badges: [] };
//   }
// };

// // ✅ Get user-specific badges
// export const getUserBadgesService = async (userId) => {
//   try {
//     const token = localStorage.getItem("token");
//     const url = `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.GET_USER_BADGES(
//       userId
//     )}`;
//     const res = await axios.get(url, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.data;
//   } catch (error) {
//     console.error(
//       "❌ Error fetching user badges:",
//       error.response?.data || error.message
//     );
//     return {
//       user_personas: [],
//       badges_by_persona: {},
//       next_badges: {},
//       total_badges: 0,
//     };
//   }
// };
import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const getToken = () => localStorage.getItem("token");

// ✅ Get all badges
export const getAllBadgesService = async () => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}/api/v1/admin/badges/all`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.badges || [];
  } catch (error) {
    console.error(
      "❌ Error fetching badges:",
      error.response?.data || error.message
    );
    return [];
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
