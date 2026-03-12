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

// ✅ Get list of instructor applications with filters
export const getInstructorApplications = async (params = {}) => {
  const token = localStorage.getItem("token");
  const { search = "", page = 1, limit = 10, status = "", date_from = "", date_to = "" } = params;

  const queryParams = new URLSearchParams({
    page,
    limit,
  });

  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (date_from) queryParams.append("date_from", date_from);
  if (date_to) queryParams.append("date_to", date_to);



  const res = await axios.get(
    `${BASE_URL}${CONSTANTS.URL.INSTRUCTOR_APPLICATION_LIST}?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );



  // Return the full response object so we can access both application and pagination
  return res.data;
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
