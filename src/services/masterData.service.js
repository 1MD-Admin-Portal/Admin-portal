import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

const unwrapList = (res, key) => {
  const data = res?.data;
  if (!data) return [];
  if (Array.isArray(data[key])) return data[key];
  if (Array.isArray(data.data)) return data.data; // backwards compatibility
  if (Array.isArray(data.results)) return data.results;
  return [];
};

export const getCountries = async () => {
  const res = await api.get(CONSTANTS.URL.MASTER_DATA.COUNTRIES());
  return unwrapList(res, "countries");
};

export const getCitiesByCountry = async (countryId) => {
  if (!countryId) return [];
  const res = await api.get(CONSTANTS.URL.MASTER_DATA.CITIES(countryId));
  return unwrapList(res, "cities");
};

export const getDanceStyles = async () => {
  const res = await api.get(CONSTANTS.URL.MASTER_DATA.DANCE_STYLES());
  return unwrapList(res, "dance_styles");
};
