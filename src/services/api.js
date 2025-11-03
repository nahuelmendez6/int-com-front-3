// src/services/api.js

// src/services/api.js
// =====================================================
// Configuración central de Axios
// Este módulo define una instancia de Axios preconfigurada
// con manejo automático de token JWT y tiempo de espera.
// =====================================================
import axios from "axios";

// Crear instancia base de Axios
const api = axios.create({
  baseURL: "http://127.0.0.1:8000", 
  timeout: 30000, // Tiempo máximo de espera por respuesta (30 segundos)
});


// =====================================================
// 🛡️ Interceptor de Request
// Agrega el token JWT automáticamente a todas las solicitudes.
// =====================================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");  // Recupera token del almacenamiento local
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Inserta cabecera Authorization
  }
  return config;
});

export default api;
