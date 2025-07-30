import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

// ✅ Approve instructor application
export const approveInstructorApplication = async (applicationId) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `${BASE_URL}${CONSTANTS.URL.APPROVE_INSTRUCTOR}`,
    { applicationId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ✅ Reject instructor application
export const rejectInstructorApplication = async (
  applicationId,
  comment = ""
) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `${BASE_URL}${CONSTANTS.URL.REJECT_INSTRUCTOR}`,
    { applicationId, comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// ✅ Get list of instructor applications
export const getInstructorApplications = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${BASE_URL}${CONSTANTS.URL.INSTRUCTOR_APPLICATION_LIST}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.application; // Only return the array
};

// ✅ NEW: Fetch professors with pagination (used for list view)
export const fetchProfessors = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.get(
      `${BASE_URL}${CONSTANTS.URL.USERS_PROFESSOR.replace(
        "page=1",
        `page=${page}`
      ).replace("limit=10", `limit=${limit}`)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error("Error fetching professors:", error);
    return { users: [], pagination: {} };
  }
};
