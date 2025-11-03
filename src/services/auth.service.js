// src/services/auth.service.js
// =====================================================
// Servicio de Autenticación
// Este módulo gestiona el registro, inicio y cierre de sesión
// utilizando la API de autenticación del backend.
// =====================================================

import axios from 'axios';

import api from './api.js'; // Instancia de Axios con interceptor de token

const API_URL = "http://127.0.0.1:8000";

// =====================================================
// Registro de usuario
// Envía los datos del formulario al endpoint de registro.
// =====================================================
export const registerUser = async (formData) => {
    try {
        const response = await api.post('/auth/register-user/', formData);
        return response.data;
    } catch (error) {
        console.error('Error axios:', error.response);
    throw error.response?.data || { detail: 'Error al registrar usuario' };
    }   
}


// =====================================================
// Inicio de sesión
// Envía credenciales y recibe tokens o datos del usuario.
// =====================================================
export const login = async (email, password) => {

    try {
        const response = await axios.post(`${API_URL}/auth/login/`, {
            email,
            password,
        });

        return response.data; // devoler role, user_id, etc

    } catch (error) {
        console.log(error);
        throw error.response?.data || { detail: "Login failed" };
    }

};

// =====================================================
// Cierre de sesión
// Elimina tokens del almacenamiento local.
// =====================================================
export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}