// services/report.service.js
import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

// 🔹 Get Reports with filters & pagination
export const getReportsService = async ({
  status = "pending",
  page = 1,
  limit = 20,
}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(CONSTANTS.URL.GET_REPORTS, {
      params: { status, page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // { message, reports, summary }
  } catch (error) {
    console.error("❌ Error fetching reports:", error?.response?.data || error);
    throw error;
  }
};

// 🔹 Update Report Status (e.g., resolved)
export const updateReportStatusService = async (reportId, status) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(
      CONSTANTS.URL.UPDATE_REPORT_STATUS(reportId),
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // expected { message: "...", updated_report: {...} }
  } catch (error) {
    console.error(
      "❌ Error updating report status:",
      error?.response?.data || error
    );
    throw error;
  }
};

// 🔹 Get Blocks with pagination
export const getBlocksService = async ({ page = 1, limit = 10 }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(CONSTANTS.URL.GET_BLOCKS, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // { message, blocks, summary }
  } catch (error) {
    console.error("❌ Error fetching blocks:", error?.response?.data || error);
    throw error;
  }
};
