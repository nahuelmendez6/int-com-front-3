// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("profile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Función auxiliar: guarda todo el estado persistente
  const persistSession = useCallback((userData, profileData) => {
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    if (profileData) localStorage.setItem("profile", JSON.stringify(profileData));
  }, []);

  // 🔹 Obtener perfil del usuario logueado
  const fetchUserProfile = useCallback(async (token) => {
    try {
      const res = await api.get("/profiles/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      localStorage.setItem("profile", JSON.stringify(res.data));
    } catch (err) {
      console.error("❌ Error al obtener el perfil:", err);
      // No borramos token enseguida — dejamos que el refresh se encargue
    }
  }, []);

  // 🔹 Intentar refrescar token si expira
  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) return null;

    try {
      const res = await api.post("/auth/refresh/", { refresh });
      const newAccess = res.data.access;
      localStorage.setItem("token", newAccess);
      return newAccess;
    } catch (err) {
      console.warn("⚠️ No se pudo refrescar el token:", err);
      logout();
      return null;
    }
  }, []);

  // 🔹 Rehidratar sesión al cargar la app
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await fetchUserProfile(token);
      } catch {
        const newToken = await refreshToken();
        if (newToken) await fetchUserProfile(newToken);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fetchUserProfile, refreshToken]);

  // 🔹 Iniciar sesión
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login/", { email, password });
      const { access, refresh, role, user_id, email: userEmail } = res.data;

      const userData = {
        id: user_id,
        email: userEmail,
        role,
        access,
        refresh,
      };

      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      persistSession(userData, null);

      setUser(userData);
      await fetchUserProfile(access);
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
      throw err;
    }
  };

  // 🔹 Cerrar sesión completamente
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    setUser(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        login,
        logout,
        loading,
        setProfile, // opcional: para actualizar datos del perfil manualmente
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
