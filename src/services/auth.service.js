
import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

export const loginService = async (email, password) => {
  try {
    const response = await api.post(
      CONSTANTS.URL.LOGIN,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Login service error:", error);
    throw error;
  }
};

export const forgotPasswordService = async (email) => {
  try {
    const response = await api.post(
      CONSTANTS.URL.FORGOT_PASSWORD,
      {
        email: email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Forgot password service error:", error);
    throw error;
  }
};

export const resetPasswordService = async (email, otp, newPassword) => {
  try {
    const response = await api.post(
      CONSTANTS.URL.RESET_PASSWORD,
      {
        email: email,
        otp: otp,
        new_password: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Reset password service error:", error);
    throw error;
  }
};

export const changePasswordService = async (currentPassword, newPassword) => {
  try {
    const response = await api.post(
      CONSTANTS.URL.CHANGE_PASSWORD,
      {
        current_password: currentPassword,
        new_password: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth header
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Change password service error:", error);
    throw error;
  }
};

export const profileService = async () => {
  try {
    const response = await api.get(CONSTANTS.URL.PROFILE, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth header
      },
    });
    return response;
  } catch (error) {
    console.error("Profile service error:", error);
    throw error;
  }
};
