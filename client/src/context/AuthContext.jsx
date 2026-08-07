import { createContext, useContext, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isAuthenticated = !!token;

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.post("/auth/login", { email, password });
            const receivedToken = res.data.accessToken;

            localStorage.setItem("token", receivedToken);
            setToken(receivedToken);
            return { success: true };
        } catch (err) {
            const message =
                err.response?.data?.message || "Login failed. Please try again.";
            setError(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{ token, isAuthenticated, loading, error, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return context;
}
