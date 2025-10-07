import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = "http://127.0.0.1:8000";

    const fetchUserProfile = async () => {
    const token = localStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }

        try {
        const response = await axios.get(`${API_URL}/profiles/user/`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        setUser(response.data);
        } catch (error) {
        console.error("Failed to fetch user profile", error);
        setUser(null);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUserProfile();
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData.user);
    localStorage.setItem("accessToken", userData.access);
    localStorage.setItem("refreshToken", userData.refresh);
    fetchUserProfile();
  };

  const logoutUser = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};