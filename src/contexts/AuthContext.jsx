// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../services/api"; // tu axios configurado

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // guarda info del user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chequea si hay token en localStorage
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/profiles/user/")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
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

    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
