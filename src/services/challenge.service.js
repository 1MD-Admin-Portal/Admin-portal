import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const getToken = () => localStorage.getItem("token");

export const createChallengeService = async (challengeData) => {
  try {
    const token = getToken();
    const res = await axios.post(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.CREATE_CHALLENGE}`,
      challengeData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error creating challenge:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllChallengesService = async (page = 1, limit = 20) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.GET_CHALLENGES}?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching challenges:",
      error.response?.data || error.message
    );
    return { challenges: [], pagination: {} };
  }
};

export const getChallengeDetailsService = async (id) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.GET_CHALLENGE_BY_ID(id)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching challenge details:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const updateChallengeService = async (id, payload) => {
  try {
    const token = getToken();
    const res = await axios.put(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.UPDATE_CHALLENGE(id)}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error updating challenge:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteChallengeService = async (id) => {
  try {
    const token = getToken();
    const res = await axios.delete(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.DELETE_CHALLENGE(id)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error deleting challenge:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateChallengeStatusService = async (id, status) => {
  try {
    const token = getToken();
    const res = await axios.put(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.UPDATE_CHALLENGE_STATUS(id)}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error updating challenge status:",
      error.response?.data || error.message
    );
    throw error;
  }
};
