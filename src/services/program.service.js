// src/services/program.service.js

import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

export const getProgramsService = async () => {
  try {
    const response = await api.get(CONSTANTS.URL.GET_PROGRAMS, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.programs;
  } catch (error) {
    console.error("Program fetch error:", error);
    throw error;
  }
};
export const createProgramService = async (programData) => {
  try {
    const response = await api.post(CONSTANTS.URL.CREATE_PROGRAM, programData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Create Program error:", error);
    throw error;
  }
};