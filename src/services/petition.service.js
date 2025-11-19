// src/services/petitions.service.js
// =====================================================
// Servicio de Peticiones (Petitions Service)
// -----------------------------------------------------
// Este módulo centraliza todas las operaciones relacionadas con las
// "peticiones" (solicitudes) dentro de la aplicación. Permite crear,
// obtener, actualizar y listar peticiones, además de recuperar tipos
// y categorías asociadas. Implementa manejo de errores, cacheo y reintentos.
// =====================================================

import { cache } from 'react';
import api from './api.js';
import cacheService from './cache.servie.js';
import retryRequest from './retry.service.js';


/**
 * Crear una nueva petición.
 * Envía los datos al backend mediante una petición POST a `/petitions/`.
 *
 * @async
 * @function createPetition
 * @param {Object} petitionData - Datos de la petición (tipo, descripción, archivos, etc.).
 * @returns {Promise<Object>} Promesa que resuelve con los datos de la petición creada.
 * @throws {Object} Error con detalles de la respuesta del servidor.
 *
 * @example
 * const newPetition = await createPetition({ type: 1, description: 'Solicitud de servicio' });
 */
export const createPetition = async (petitionData) => {

    try {
        const response = await api.post('/petitions/', petitionData);
        return response.data;
    } catch (error) {
        console.error("Error creating petition", error.response?.data);
        throw error.response?.data || { detail: 'Error creating petition' };
    }
};

/**
 * Obtener todos los tipos de peticiones disponibles.
 * Ideal para cargar en formularios de creación o filtros.
 *
 * @async
 * @function getPetitionTypes
 * @returns {Promise<Object[]>} Lista de tipos de peticiones.
 *
 * @example
 * const types = await getPetitionTypes();
 * console.log(types);
 */
export const getPetitionTypes = async () => {
    try {
        const response = await api.get('/petitions/type-petitions/');
        return response.data;
    } catch (error) {
        console.error('Error fetching petition types:', error);
        throw error;
    }
};

/**
 * Obtener todas las peticiones asociadas a un cliente específico.
 *
 * @async
 * @function getPetitionsByCustomer
 * @param {number|string} customerId - ID del cliente.
 * @returns {Promise<Object[]>} Lista de peticiones del cliente.
 *
 * @example
 * const petitions = await getPetitionsByCustomer(12);
 */
export const getPetitionsByCustomer = async (customerId) => {
  try {
    const response = await api.get(`/petitions/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching petitions by customer:', error);
    throw error;
  }
};

/**
 * Obtener las categorías disponibles (generalmente asociadas a perfiles).
 *
 * @async
 * @function getCategories
 * @returns {Promise<Object[]>} Lista de categorías disponibles.
 *
 * @example
 * const categories = await getCategories();
 * console.log(categories);
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/profiles/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Obtener todas las peticiones, con soporte de cache y reintentos automáticos.
 * 
 * - Usa `cacheService` para evitar solicitudes repetidas en un corto período.
 * - Usa `retryRequest` para reintentar hasta 3 veces con intervalo de 1s.
 *
 * @async
 * @function getPetitions
 * @returns {Promise<Object[]>} Lista de todas las peticiones.
 *
 * @example
 * const petitions = await getPetitions();
 */
export const getPetitions = async () => {
    const cacheKey = cacheService.generateKey('petitions');

    return cacheService.getOrSet(
        cacheKey,
        async () => {
            return retryRequest(async () => {
                const response = await api.get('/petitions/');
                return response.data;
            }, 3, 1000);
        },
        2 * 60 * 1000 // cache por 2 minutos
    );
};

/**
 * Obtener una petición específica por su ID.
 *
 * @async
 * @function getPetition
 * @param {number|string} id - ID de la petición a consultar.
 * @returns {Promise<Object>} Datos de la petición.
 *
 * @example
 * const petition = await getPetition(5);
 */
export const getPetition = async (id) => {
  try {
    const response = await api.get(`/petitions/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching petition ${id}:`, error);
    throw error;
  }
};

/**
 * Actualizar parcialmente una petición existente.
 * Realiza una petición PATCH al endpoint `/petitions/{id}/`.
 *
 * @async
 * @function updatePetition
 * @param {number|string} id - ID de la petición a actualizar.
 * @param {Object} petitionData - Campos a modificar (p. ej., estado o descripción).
 * @returns {Promise<Object>} Petición actualizada.
 *
 * @example
 * await updatePetition(10, { status: 'resuelta' });
 */
export const updatePetition = async (id, petitionData) => {
  try {
    const response = await api.patch(`/petitions/${id}/`, petitionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating petition ${id}:`, error.response?.data);
    throw error;
  }
};

/**
 * Eliminar una petición (soft delete).
 * Marca la petición como eliminada mediante el campo `is_deleted: true`.
 *
 * @async
 * @function deletePetition
 * @param {number|string} id - ID de la petición a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor con la petición actualizada.
 *
 * @example
 * await deletePetition(8);
 */
export const deletePetition = async (id) => {
  const response = await api.patch(`/petitions/${id}/`, { is_deleted: true });
  return response.data;
};
