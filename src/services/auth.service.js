import api from "../api/api";
import { CONSTANTS } from "../utils/constants";

export const loginService = async (email,password) => {
    try {
        const response = await api.post(CONSTANTS.URL.LOGIN, JSON.stringify({
            email: email,
            password: password
        }),
        {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
    } catch (error) {
        console.error("Login service error:", error);
        throw error;
    }
}
export const profileService = async (email,password) => {
    try {
        // const response = await api.get(CONSTANTS.URL.LOGIN, JSON.stringify({
        //     email: email,
        //     password: password
        // }),
const response = await api.get(CONSTANTS.URL.LOGIN, {
    params: { email, password },
    headers: {
        "Content-Type": "application/json",
    },
});
        return response;
    } catch (error) {
        console.error("Login service error:", error);
        throw error;
    }
}