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

export const getOrganizerApplications = async (params = {}) => {
  const { search = "", page = 1, limit = 10, status = "", date_from = "", date_to = "" } = params;
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams({ page, limit });
  if (search) queryParams.append("search", search);
  if (status) queryParams.append("status", status);
  if (date_from) queryParams.append("date_from", date_from);
  if (date_to) queryParams.append("date_to", date_to);
  const res = await axios.get(
    `${BASE_URL}${CONSTANTS.URL.ORGANIZER_APPLICATION_LIST}?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
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
