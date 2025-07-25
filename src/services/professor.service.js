// services/professor.service.js
import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

export const approveInstructorApplication = async (applicationId) => {
  const token = localStorage.getItem("token"); // <-- or from your auth store

  const res = await axios.post(
    `${BASE_URL}${CONSTANTS.URL.APPROVE_INSTRUCTOR}`, // e.g. /api/v1/user/approveInstructorApplication
    { applicationId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const rejectInstructorApplication = async (
  applicationId,
  comment = ""
) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${BASE_URL}${CONSTANTS.URL.REJECT_INSTRUCTOR}`, // e.g. /api/v1/user/rejectInstructorApplication
    { applicationId, comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
