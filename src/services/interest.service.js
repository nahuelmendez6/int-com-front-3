// src/services/interests.service.js
// =====================================================
// Servicio de Intereses y Categorías (Interests Service)
// -----------------------------------------------------
// Este módulo gestiona toda la lógica relacionada con las
// categorías y los intereses de los clientes, incluyendo:
// - Obtención de categorías disponibles
// - Registro y eliminación de intereses de un cliente
// - Consulta de intereses por cliente
// =====================================================

import api from './api';
// =====================================================
// Obtener todas las categorías disponibles
// -----------------------------------------------------
// @returns {Promise<Object[]>} Lista de categorías disponibles
// =====================================================
export const getCategories = () => {
  return api.get('/profiles/categories/');
};

// =====================================================
// Guardar interés de un cliente
// -----------------------------------------------------
// @param {number|string} id_customer - ID del cliente
// @param {number|string} id_category - ID de la categoría seleccionada
// @returns {Promise<Object>} Interés creado o actualizado
// =====================================================
export const saveInterest = (id_customer, id_category) => {
  return api.post('/interests/', { id_customer, id_category });
};

// =====================================================
// Obtener intereses por cliente
// -----------------------------------------------------
// @param {number|string} id_customer - ID del cliente
// @returns {Promise<Object[]>} Lista de intereses del cliente
// =====================================================
export const getInterestsByCustomer = (id_customer) => {
  return api.get(`/interests/?id_customer=${id_customer}`);
};


// =====================================================
// Eliminar interés de un cliente
// -----------------------------------------------------
// @param {number|string} interestId - ID del interés a eliminar
// @returns {Promise<void>} Confirmación de eliminación
// =====================================================
export const deleteInterest = (interestId) => {
  return api.delete(`/interests/${interestId}/`);
};
