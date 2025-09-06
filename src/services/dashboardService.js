import axios from "axios";
import { CONSTANTS } from "../utils/constants";

const BASE_URL = CONSTANTS.URL.BASE_URL;

// ✅ Get dashboard metrics with filters
export const getDashboardMetrics = async (filters = {}) => {
  const token = localStorage.getItem("token");

  try {
    // Build query parameters
    const queryParams = new URLSearchParams();

    // Add year parameter if specified and not "all"
    if (filters.year && filters.year !== "all") {
      queryParams.append("year", filters.year);
    }

    // Add month parameter if specified and not "all"
    if (filters.month && filters.month !== "all") {
      queryParams.append("month", filters.month);
    }

    // Construct the full URL
    const endpoint = `${BASE_URL}${CONSTANTS.URL.DASHBOARD}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    console.log("API Endpoint:", endpoint); // Debug log to see the actual URL being called

    const res = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API Response:", res.data); // Debug log to see the response

    // Return the response data directly since your API returns the expected format
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    console.error("Error details:", error.response?.data); // More detailed error logging
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch dashboard data",
    };
  }
};

// ✅ Format currency helper
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(parseFloat(amount) || 0);
};

// ✅ Format number helper
export const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US").format(parseInt(number) || 0);
};

// ✅ Format metric based on type
export const formatMetric = (value, format) => {
  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "number":
      return formatNumber(value);
    default:
      return value || 0;
  }
};

// Export as default object
const dashboardService = {
  getDashboardMetrics,
  formatCurrency,
  formatNumber,
  formatMetric,
};

export default dashboardService;
