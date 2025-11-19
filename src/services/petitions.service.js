// src/services/petitions.service.js
// =====================================================
// Servicio de Peticiones (Petitions Service)
// -----------------------------------------------------
// Este módulo gestiona todas las operaciones CRUD relacionadas con las
// peticiones dentro de la aplicación. Proporciona funciones para crear,
// listar, actualizar, eliminar (soft delete) y obtener tipos de peticiones,
// así como el feed de peticiones visibles para proveedores.
// =====================================================
import api from './api';


/**
 * Obtener todas las peticiones disponibles.
 * Realiza una solicitud GET al endpoint `/petitions/`.
 *
 * @async
 * @function getPetitions
 * @returns {Promise<Object[]>} Promesa que resuelve con la lista de peticiones.
 *
 * @example
 * const petitions = await getPetitions();
 * console.log(petitions);
 */
export const getPetitions = async () => {
  try {
    const response = await api.get('/petitions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching petitions:', error);
    throw error;
  }
};

/**
 * Crear una nueva petición.
 * Envía los datos en formato multipart/form-data para soportar archivos adjuntos.
 * Realiza una solicitud POST a `/petitions/`.
 *
 * @async
 * @function createPetition
 * @param {FormData} petitionData - Datos de la nueva petición (texto, archivos, etc.).
 * @returns {Promise<Object>} Petición creada.
 *
 * @example
 * const formData = new FormData();
 * formData.append('title', 'Nueva solicitud');
 * formData.append('attachment', file);
 * const petition = await createPetition(formData);
 */
export const createPetition = async (petitionData) => {
  try {
    const response = await api.post('/petitions/', petitionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating petition:', error);
    throw error;
  }
};

/**
 * Obtener los tipos de peticiones disponibles.
 * Ideal para mostrar en formularios o filtros.
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
 * Actualizar parcialmente una petición existente.
 * Soporta actualización de campos y archivos mediante multipart/form-data.
 *
 * @async
 * @function updatePetition
 * @param {number|string} id - ID de la petición a actualizar.
 * @param {FormData} petitionData - Datos actualizados de la petición.
 * @returns {Promise<Object>} Petición actualizada.
 *
 * @example
 * const formData = new FormData();
 * formData.append('status', 'en_proceso');
 * await updatePetition(5, formData);
 */
export const updatePetition = async (id, petitionData) => {
  try {
    const response = await api.patch(`/petitions/${id}/`, petitionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating petition:', error);
    throw error;
  }
};


export const deletePetition = async (id) => {
  try {
    const response = await api.patch(
      `/petitions/${id}/`, { is_deleted: true }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating petition:', error);
    throw error;
}}

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


/**
 * Obtener el feed de peticiones visible para el proveedor autenticado.
 * Muestra peticiones disponibles o relevantes según su perfil.
 *
 * @async
 * @function getProviderFeedPetitions
 * @returns {Promise<Object[]>} Lista de peticiones del feed del proveedor.
 *
 * @example
 * const feed = await getProviderFeedPetitions();
 * console.log(feed);
 */
export const getProviderFeedPetitions = async () => {
  try {
    const response = await api.get('/petitions/provider-feed/');
    return response.data;
  } catch (error) {
    console.error('Error fetching provider feed petitions:', error);
    throw error;
  }
};
