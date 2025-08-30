import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/apiService";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (userData) => {
    try {
      const response = await apiService.post("/auth/login", userData);
      setUser(response.data.user);
      setToken(response.data.token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.post("/auth/register", userData);
      setUser(response.data.user);
      setToken(response.data.token);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token, register }}>
      {children}
    </AuthContext.Provider>
  );
};
