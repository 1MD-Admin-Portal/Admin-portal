import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const getToken = () => localStorage.getItem("token");

// ✅ Get all submissions for a specific challenge
export const getChallengeSubmissionsService = async (
  challengeId,
  page = 1,
  limit = 20
) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${
        CONSTANTS.URL.BASE_URL
      }${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.GET_BY_CHALLENGE(
        challengeId,
        page,
        limit
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching challenge submissions:",
      error.response?.data || error.message
    );
    return { submissions: [], pagination: {} };
  }
};

// ✅ Get pending submissions
export const getPendingSubmissionsService = async (page = 1, limit = 20) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${
        CONSTANTS.URL.BASE_URL
      }${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.GET_PENDING(page, limit)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching pending submissions:",
      error.response?.data || error.message
    );
    return { submissions: [], pagination: {} };
  }
};

// ✅ Get submission details
export const getSubmissionDetailsService = async (submissionId) => {
  try {
    const token = getToken();
    const res = await axios.get(
      `${
        CONSTANTS.URL.BASE_URL
      }${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.GET_DETAILS(submissionId)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching submission details:",
      error.response?.data || error.message
    );
    return null;
  }
};

// ✅ Approve submission
export const approveSubmissionService = async (submissionId) => {
  try {
    const token = getToken();
    const res = await axios.put(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.APPROVE(
        submissionId
      )}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error approving submission:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Reject submission
export const rejectSubmissionService = async (submissionId) => {
  try {
    const token = getToken();
    const res = await axios.put(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.CHALLENGE_SUBMISSIONS.REJECT(
        submissionId
      )}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error rejecting submission:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteChallengeSubmissionService = async (submissionId) => {
  try {
    const token = getToken();
    const res = await axios.delete(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.DELETE_SUBMISSION(
        submissionId
      )}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error deleting challenge submission:",
      error.response?.data || error.message
    );
    throw error;
  }
};
