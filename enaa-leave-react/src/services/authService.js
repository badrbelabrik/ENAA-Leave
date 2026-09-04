import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Automatically attach the Sanctum token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Login
 */
export const loginRequest = async (email, password) => {
    const response = await api.post("/login", {
        email,
        password,
    });

    return response.data;
};

/**
 * Get the currently authenticated user
 */
export const getCurrentUser = async () => {
    const response = await api.get("/me");

    console.log("ME response:", response.data);

    return response.data.user;
};

/**
 * Logout
 */
export const logoutRequest = async () => {
    const response = await api.post("/logout");

    return response.data;
};

export default api;