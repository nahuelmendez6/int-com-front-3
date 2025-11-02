// src/hooks/useAuth.js

// Importa la función useContext de React, que permite acceder al valor de un contexto global.
import { useContext } from "react";

// Importa el contexto de autenticación previamente definido en AuthContext.jsx.
// Este contexto contiene toda la lógica y los datos del usuario autenticado.
import { AuthContext } from "../contexts/AuthContext";



// Hook personalizado: useAuth
// Este hook es una abstracción sencilla para acceder al contexto de autenticación
// desde cualquier componente, sin tener que importar y usar useContext manualmente.
export const useAuth = () => {
  // Devuelve directamente el valor del AuthContext,
  // que incluye funciones (login, logout), estados (user, profile, loading) y setters.
  return useContext(AuthContext);
};
