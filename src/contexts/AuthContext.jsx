// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../services/api"; // tu axios configurado

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // guarda info del user
  const [profile, setProfile] = useState(null); // guarda info del profile
  const [loading, setLoading] = useState(true);
  
  const fetchUserProfile = async (token) => {
    if (!token) return;

    try {
      const res = await api.get("/profiles/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      setProfile(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);


  const login = async (email, password) => {
    const res = await api.post("/auth/login/", { email, password });

    // ejemplo: el backend devuelve { token, user: {..., id_customer, id_provider} }
    const { access, refresh, role, user_id, email: userEmail } = res.data;

    localStorage.setItem("token", access);
    localStorage.setItem("refreshToken", refresh);
    setUser({
      id: user_id,
      email: userEmail,
      role,
      access,
      refresh,
    });

    await fetchUserProfile(access);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
