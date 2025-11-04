// src/services/postulations.service.js
// =====================================================
// Servicio de Postulaciones (Postulations Service)
// -----------------------------------------------------
// Este módulo gestiona todas las operaciones relacionadas con las
// postulaciones dentro de la aplicación. Permite crear, obtener,
// actualizar y aceptar postulaciones, tanto desde el lado del proveedor
// como del cliente. Incluye manejo de errores detallado para depuración.
// =====================================================

import api from './api';


/**
 * Crear una nueva postulación.
 * Envía los datos de la postulación mediante POST a `/postulations/`.
 *
 * @async
 * @function createPostulation
 * @param {Object} postulationData - Datos de la postulación (ej. id_petition, mensaje, monto, etc.).
 * @returns {Promise<Object>} Postulación creada.
 * @throws {Error} Lanza un error si la creación falla.
 *
 * @example
 * const postulation = await createPostulation({
 *   id_petition: 12,
 *   message: 'Puedo realizar este trabajo en 3 días.',
 *   price: 5000
 * });
 */
export const createPostulation = async (postulationData) => {
  try {
    const response = await api.post('/postulations/', postulationData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error creating postulation:', error.response.data);
    } else {
      console.error('Error creating postulation:', error.message);
    }
    throw error;
  }
};

/**
 * Obtener todas las postulaciones asociadas a una petición específica.
 * Realiza una solicitud GET a `/postulations/by-petition/{petitionId}`.
 *
 * @async
 * @function getPostulationsByPetition
 * @param {number|string} petitionId - ID de la petición.
 * @returns {Promise<Object[]>} Lista de postulaciones asociadas.
 * @throws {Error} Lanza un error si la obtención falla.
 *
 * @example
 * const postulations = await getPostulationsByPetition(10);
 * console.log(postulations);
 */
export const getPostulationsByPetition = async (petitionId) => {
  try {
    const response = await api.get(`/postulations/by-petition/${petitionId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error fetching postulations:', error.response.data);
    } else {
      console.error('Error fetching postulations:', error.message);
    }
    throw error;
  }
};

/**
 * Obtener todas las postulaciones realizadas por el proveedor autenticado.
 * Realiza una solicitud GET a `/postulations/`.
 *
 * @async
 * @function getProviderPostulations
 * @returns {Promise<Object[]>} Lista de postulaciones del proveedor.
 * @throws {Error} Lanza un error si la obtención falla.
 *
 * @example
 * const providerPostulations = await getProviderPostulations();
 */
export const getProviderPostulations = async () => {
  try {
    const response = await api.get('/postulations/');
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error fetching provider postulations:', error.response.data);
    } else {
      console.error('Error fetching provider postulations:', error.message);
    }
    throw error;
  }
};

/**
 * Actualizar parcialmente una postulación existente.
 * Realiza una solicitud PATCH a `/postulations/{postulationId}/`.
 *
 * @async
 * @function updatePostulation
 * @param {number|string} postulationId - ID de la postulación.
 * @param {Object} data - Campos a actualizar (estado, mensaje, etc.).
 * @returns {Promise<Object>} Postulación actualizada.
 * @throws {Error} Lanza un error si la actualización falla.
 *
 * @example
 * await updatePostulation(8, { status: 'rechazada' });
 */
export const updatePostulation = async (postulationId, data) => {
  try {
    const response = await api.patch(`/postulations/${postulationId}/`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error updating postulation:', error.response.data);
    } else {
      console.error('Error updating postulation:', error.message);
    }
    throw error;
  }
};

/**
 * Aceptar una postulación específica.
 * Realiza una solicitud POST a `/postulations/{postulationId}/accept/`,
 * marcándola como aceptada por el cliente.
 *
 * @async
 * @function acceptPostulation
 * @param {number|string} postulationId - ID de la postulación a aceptar.
 * @returns {Promise<Object>} Postulación aceptada.
 * @throws {Error} Lanza un error si la aceptación falla.
 *
 * @example
 * await acceptPostulation(14);
 */
export const acceptPostulation = async (postulationId) => {
  try {
    const response = await api.post(`/postulations/${postulationId}/accept/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error accepting postulation:', error.response.data);
    } else {
      console.error('Error accepting postulation:', error.message);
    }
    throw error;
  }
};