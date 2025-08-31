import { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/apiService";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Fetch user data when component mounts if token exists
  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !user) {
        try {
          const response = await apiService.get("/auth/me");
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setToken(null);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [token, user]);

  const login = async (userData) => {
    try {
      const response = await apiService.post("/auth/login", userData);
      setUser(response.data.user);
      setToken(response.data.token);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log("Sending registration data:", userData);
      const response = await apiService.post("/auth/register", userData);
      console.log("Registration response:", response.data);
      setUser(response.data.user);
      setToken(response.data.token);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      console.error("Error details:", error.response?.data);

      // Handle specific Prisma errors
      if (error.response?.data?.code === "P2002") {
        throw new Error("Email already exists. Please use a different email.");
      }

      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, token, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
