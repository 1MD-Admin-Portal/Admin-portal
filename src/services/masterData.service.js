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

export const getStatesByCountryName = async (countryName) => {
  if (!countryName) return [];
  try {
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: countryName }),
    });
    const json = await res.json();
    if (json.error || !json.data?.states) return [];
    return json.data.states; // [{ name: "California", state_code: "CA" }, ...]
  } catch (e) {
    console.error("Failed to fetch states:", e);
    return [];
  }
};

export const getDanceStyles = async () => {
  const res = await api.get(CONSTANTS.URL.MASTER_DATA.DANCE_STYLES());
  return unwrapList(res, "dance_styles");
};
