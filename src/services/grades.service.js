// src/services/grades.service.js
// =====================================================
// Servicio de Calificaciones (Grades Service)
// -----------------------------------------------------
// Este módulo maneja todas las operaciones relacionadas con las
// calificaciones entre clientes y proveedores, incluyendo:
// - Creación de calificaciones
// - Obtención de calificaciones individuales o promedio
// - Filtrado por proveedor o cliente
// =====================================================

import api from './api';


// =====================================================
// Crear calificación para un proveedor
// -----------------------------------------------------
// @param {Object} gradeData - Datos de la calificación (ej: score, comment, provider_id, etc.)
// @returns {Promise<Object>} Calificación creada.
// =====================================================
const gradesService = {
  createGrade: async (gradeData) => {
    try {
      const response = await api.post('/grades/', gradeData);
      return response.data;
    } catch (error) {
      console.error("Error al enviar la calificación", error.response?.data || error.message);
      throw error;
    }
  },

  // =====================================================
// 🔍 Obtener todas las calificaciones de un proveedor
// -----------------------------------------------------
// @param {number|string} providerId - ID del proveedor.
// @returns {Promise<Object[]>} Lista de calificaciones.
// =====================================================
  getGradesByProvider: async (providerId) => {
    try {
      const response = await api.get(`/grades/?provider=${providerId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las calificaciones", error.response?.data || error.message);
      throw error;
    }
  },
// =====================================================
// Obtener calificación promedio de un proveedor
// -----------------------------------------------------
// @param {number|string} providerId - ID del proveedor.
// @returns {Promise<Object>} Objeto con la calificación promedio.
// =====================================================
  getAverageRatingByProvider: async (providerId) => {
    try {
      const response = await api.get(`/grades/average-rating/${providerId}/`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la calificación promedio", error.response?.data || error.message);
      throw error;
    }
  },
// =====================================================
//  Crear calificación para un cliente
// -----------------------------------------------------
// @param {Object} gradeData - Datos de la calificación.
// @returns {Promise<Object>} Calificación creada.
// =====================================================
  createGradeForCustomer: async (gradeData) => {
    try {
      const response = await api.post('/grades/grades-customer/', gradeData);
      return response.data;
    } catch (error) {
      console.error("Error al enviar la calificación para el cliente", error.response?.data || error.message);
      throw error;
    }
  },
// =====================================================
// Obtener calificaciones de un cliente
// -----------------------------------------------------
// @param {number|string} customerId - ID del cliente.
// @returns {Promise<Object[]>} Lista de calificaciones del cliente.
// =====================================================
  getGradesByCustomer: async (customerId) => {
    try {
      const response = await api.get(`/grades/grades-customer/?customer=${customerId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las calificaciones del cliente", error.response?.data || error.message);
      throw error;
    }
  },
};
// =====================================================
// Exportación del servicio
// =====================================================
export default gradesService;
