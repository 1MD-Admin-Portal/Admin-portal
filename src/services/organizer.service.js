// services/organizer.service.js
import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

export const approveOrganizerApplication = async (applicationId) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `${BASE_URL}${CONSTANTS.URL.APPROVE_ORGANIZER}`,
    { applicationId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const rejectOrganizerApplication = async (
  applicationId,
  comment = ""
) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `${BASE_URL}${CONSTANTS.URL.REJECT_ORGANIZER}`,
    { applicationId, comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getOrganizerApplications = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${BASE_URL}${CONSTANTS.URL.ORGANIZER_APPLICATION_LIST}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.applications;
};

// ✅ Add this to fetch organizer users list with pagination
// services/organizer.service.js
export const fetchOrganizers = async (page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  try {
    const url = `${BASE_URL}/api/v1/admin/users?userType=organiser&page=${page}&limit=${limit}`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching organizers:", error);
    return { users: [], pagination: {} };
  }
};
