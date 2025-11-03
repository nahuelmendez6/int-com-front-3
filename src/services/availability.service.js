// src/services/availability.service.js
// =====================================================
// Servicio de Disponibilidad del Proveedor
// Este módulo gestiona todas las operaciones relacionadas con
// la disponibilidad de los proveedores: consulta, actualización,
// edición y eliminación de horarios o turnos.
// =====================================================

import api from './api.js'


// =====================================================
// Obtener disponibilidad de un proveedor
// -----------------------------------------------------
// @param {number|string} providerId - ID del proveedor.
// @returns {Promise<Object[]>} Lista de disponibilidades.
// =====================================================
export const getProviderAvailability = async (providerId) => {
  try {
    const response = await api.get(`/availability/provider/${providerId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching provider availability:', error);
    throw error;
  }
};

// =====================================================
// Crear o actualizar disponibilidad
// -----------------------------------------------------
// @param {Object} availabilityData - Datos de la disponibilidad.
// @returns {Promise<Object>} Resultado de la operación.
// =====================================================
export const updateProviderAvailability = async (availabilityData) => {
  try {
    // Endpoint "/availability/add/" se usa para crear o sobreescribir slots
    const response = await api.post('/availability/add/', availabilityData);
    return response.data;
  } catch (error) {
    console.error('Error updating provider availability:', error.response?.data || error);
    throw error;
  }
};

// =====================================================
// Eliminar disponibilidad
// -----------------------------------------------------
// @param {number|string} availabilityId - ID del registro a eliminar.
// @returns {Promise<Object>} Respuesta del backend.
// =====================================================
export const deleteProviderAvailability = async (availabilityId) => {
  try {
    const response = await api.delete(`/availability/edit/${availabilityId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting provider availability:', error.response?.data || error);
    throw error;
  }
};

// =====================================================
// Editar disponibilidad existente
// -----------------------------------------------------
// @param {number|string} availabilityId - ID de la disponibilidad a editar.
// @param {Object} availabilityData - Nuevos datos a aplicar.
// @returns {Promise<Object>} Respuesta del backend.
// =====================================================
export const editProviderAvailability = async (availabilityId, availabilityData) => {
  try {
    const response = await api.patch(`/availability/edit/${availabilityId}/`, availabilityData);
    return response.data;
  } catch (error) {
    console.error('Error editing provider availability:', error.response?.data || error);
    throw error;
  }
};
