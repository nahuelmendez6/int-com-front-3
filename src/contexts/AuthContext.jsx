// src/context/AuthContext.jsx

// Importa herramientas de React: createContext para crear el contexto global,
// useState para manejar estados locales, useEffect para efectos secundarios,
// y useCallback para memorizar funciones y evitar renders innecesarios.
import { createContext, useState, useEffect, useCallback } from "react";

// Importa la instancia configurada de Axios para realizar peticiones HTTP al backend.
import api from "../services/api";

// Crea y exporta el contexto de autenticación.
// Este contexto permitirá acceder al estado del usuario desde cualquier componente de la app.
export const AuthContext = createContext();


// Define y exporta el proveedor del contexto.
// Este componente envuelve a la aplicación y gestiona la lógica de autenticación.
export const AuthProvider = ({ children }) => {

  // Estado del usuario autenticado (datos básicos).
  // Se inicializa con la información guardada en localStorage, si exist
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });


  // Estado del perfil del usuario (información más detallada del backend).
  // También se rehidrata desde localStorage al iniciar la app.
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("profile");
    return savedProfile ? JSON.parse(savedProfile) : null;
  });

  // Estado de carga para mostrar spinners o pantallas de espera mientras se valida la sesión.  
  const [loading, setLoading] = useState(true);

  // Función auxiliar: guarda los datos del usuario y perfil en localStorage.
  // Se utiliza cada vez que se inicia sesión o se actualiza información.
  const persistSession = useCallback((userData, profileData) => {
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    if (profileData) localStorage.setItem("profile", JSON.stringify(profileData));
  }, []);


  // Obtiene el perfil del usuario autenticado desde el backend usando el token JWT.
  const fetchUserProfile = useCallback(async (token) => {
    try {
      const res = await api.get("/profiles/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Guarda el perfil tanto en estado como en localStorage.
      setProfile(res.data);
      localStorage.setItem("profile", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error al obtener el perfil:", err);
      // No se elimina el token aquí: el refresco de sesión se encarga si expira.
    }
  }, []);

    // Intenta refrescar el token de acceso si ha expirado.
  // Usa el refresh token almacenado localmente para obtener uno nuevo.
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


  // Efecto inicial: rehidrata la sesión al cargar la aplicación.
  // Si hay token, intenta recuperar el perfil; si expira, intenta refrescarlo.
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetchUserProfile(token);
        } catch {
          const newToken = await refreshToken();
          if (newToken) {
            await fetchUserProfile(newToken);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    init();
  }, [fetchUserProfile, refreshToken]);

  // Inicia sesión del usuario.
  // Envía las credenciales al backend, guarda los tokens y carga el perfil.
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
      // Guarda los tokens en localStorage.
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);

      // Persiste la información básica del usuario.
      persistSession(userData, null);
      
       // Actualiza el estado y carga el perfil desde el backend.
      setUser(userData);
      await fetchUserProfile(access);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      throw err;
    }
  };

  // Cierra completamente la sesión.
  // Limpia los datos de localStorage y resetea los estados.
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    setUser(null);
    setProfile(null);
  }, []);
  // Provee el contexto de autenticación a toda la aplicación.
  // Cualquier componente dentro del AuthProvider puede acceder a user, login, logout, etc.
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
      {/* Renderiza los componentes hijos dentro del proveedor */}
      {children}
    </AuthContext.Provider>
  );
};