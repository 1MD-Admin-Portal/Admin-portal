// Enhanced Challenge Service with all new functions
import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const getToken = () => localStorage.getItem("token");
const baseURL = CONSTANTS.URL.BASE_URL;

// === CORE CHALLENGE SERVICES ===
export const createChallengeService = async (challengeData) => {
  try {
    const token = getToken();
    const res = await axios.post(
      `${baseURL}${CONSTANTS.URL.CREATE_CHALLENGE}`,
      challengeData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error creating challenge:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllChallengesService = async (page = 1, limit = 20) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${baseURL}${CONSTANTS.URL.GET_CHALLENGES}?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching challenges:",
      error.response?.data || error.message
    );
    return { challenges: [], pagination: {} };
  }
};

export const getChallengeDetailsService = async (id) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${baseURL}${CONSTANTS.URL.GET_CHALLENGE_BY_ID(id)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching challenge details:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const updateChallengeService = async (id, payload) => {
  try {
    const token = getToken();
    const res = await axios.put(
      `${baseURL}${CONSTANTS.URL.UPDATE_CHALLENGE(id)}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error updating challenge:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteChallengeService = async (id) => {
  try {
    const token = getToken();
    const res = await axios.delete(
      `${baseURL}${CONSTANTS.URL.DELETE_CHALLENGE(id)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error deleting challenge:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateChallengeStatusService = async (id, status) => {
  try {
    const token = getToken();
    const res = await axios.put(
      `${baseURL}${CONSTANTS.URL.UPDATE_CHALLENGE_STATUS(id)}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error updating challenge status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// === SUBMISSION SERVICES ===
export const getChallengeSubmissionsService = async (
  challengeId,
  page = 1,
  limit = 20
) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${baseURL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.GET_BY_CHALLENGE(
        challengeId,
        page,
        limit
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching submissions:",
      error.response?.data || error.message
    );
    return { submissions: [], pagination: {} };
  }
};

export const getPendingSubmissionsService = async (page = 1, limit = 20) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${baseURL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.GET_PENDING(
        page,
        limit
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching pending submissions:",
      error.response?.data || error.message
    );
    return { submissions: [], pagination: {} };
  }
};

export const getSubmissionDetailsService = async (submissionId) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${baseURL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.GET_DETAILS(
        submissionId
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching submission details:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const approveSubmissionService = async (
  submissionId,
  adminFeedback = ""
) => {
  try {
    const token = getToken();
    const res = await axios.put(
      `${baseURL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.APPROVE(submissionId)}`,
      { admin_feedback: adminFeedback },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error approving submission:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const rejectSubmissionService = async (
  submissionId,
  adminFeedback = ""
) => {
  try {
    const token = getToken();
    const res = await axios.put(
      `${baseURL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.REJECT(submissionId)}`,
      { admin_feedback: adminFeedback },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error rejecting submission:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteSubmissionService = async (submissionId) => {
  try {
    const token = getToken();
    const res = await axios.delete(
      `${baseURL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.DELETE_SUBMISSION(
        submissionId
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error deleting submission:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// === PARTICIPANTS SERVICES ===
export const getChallengeParticipantsService = async (
  challengeId,
  page = 1,
  limit = 20
) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${baseURL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.GET_CHALLENGE_PARTICIPANTS(
        challengeId,
        page,
        limit
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching participants:",
      error.response?.data || error.message
    );
    return { participants: [], pagination: {} };
  }
};

export const removeParticipantService = async (challengeId, userId) => {
  try {
    const token = getToken();
    const res = await axios.delete(
      `${baseURL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.REMOVE_PARTICIPANT(
        challengeId,
        userId
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error removing participant:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// === ANALYTICS SERVICE ===
export const getChallengeAnalyticsService = async (challengeId) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${baseURL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.GET_CHALLENGE_ANALYTICS(
        challengeId
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error fetching analytics:",
      error.response?.data || error.message
    );
    return null;
  }
};

// === COMMENT SERVICE ===
export const deleteCommentService = async (commentId) => {
  try {
    const token = getToken();
    const res = await axios.delete(
      `${baseURL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.DELETE_COMMENT(
        commentId
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error deleting comment:",
      error.response?.data || error.message
    );
    throw error;
  }
};
