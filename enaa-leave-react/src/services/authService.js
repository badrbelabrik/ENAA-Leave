import api from "../api/axios";

export const login = async (email, password) => {
    const response = await api.post("/login", {
        email,
        password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
};

export const logout = async () => {
    await api.post("/logout");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getCurrentUser = async () => {
    const response = await api.get("/me");

    console.log("ME response:", response.data);

    return response.data.user;
};