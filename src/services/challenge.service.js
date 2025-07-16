// // src/services/challenge.service.js
// import api from "../api/api";
// import { CONSTANTS } from "../utils/constants";

// export const getChallengesService = async () => {
//   try {
//     const response = await api.get(CONSTANTS.URL.GET_CHALLENGES, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     return response;
//   } catch (error) {
//     console.error("Challenge fetch error:", error);
//     throw error;
//   }
// };
// export const createChallengeService = async (data) => {
//   try {
//     const response = await api.post(CONSTANTS.URL.CHALLENGE_CREATE, data, {
//       headers: { "Content-Type": "application/json" }
//     });
//     return response;
//   } catch (error) {
//     console.error("Challenge creation error:", error);
//     throw error;
//   }
// };
// src/services/challenge.service.js
import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

/**
 * Fetch challenges with pagination and optional filters.
 * @param {Object} params - { page, limit, search, status, duration, participants }
 */
export const getChallengesService = async (params = {}) => {
  try {
    const response = await api.get(CONSTANTS.URL.GET_CHALLENGES, {
      headers: {
        "Content-Type": "application/json",
      },
      params, // query parameters passed here
    });
    return response;
  } catch (error) {
    console.error("Challenge fetch error:", error);
    throw error;
  }
};

export const createChallengeService = async (data) => {
  try {
    const response = await api.post(CONSTANTS.URL.CHALLENGE_CREATE, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Challenge creation error:", error);
    throw error;
  }
};
