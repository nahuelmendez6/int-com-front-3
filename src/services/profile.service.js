// src/services/profile.service.js
// =====================================================
// Servicio de Perfiles (Profile Service)
// -----------------------------------------------------
// Este módulo gestiona las operaciones relacionadas con los perfiles
// de usuarios y proveedores dentro de la aplicación. Incluye funciones
// para obtener, actualizar y consultar perfiles, categorías, tipos de
// proveedores y profesiones.
// =====================================================

import api from './api';


/**
 * Obtener el perfil del usuario autenticado.
 * Realiza una solicitud GET a `/profiles/`.
 *
 * @async
 * @function getProfile
 * @returns {Promise<Object>} Perfil del usuario autenticado.
 * @throws {Error} Lanza un error si la solicitud falla.
 *
 * @example
 * const profile = await profileService.getProfile();
 */
const getProfile = () => {
  return api.get('/profiles/');
};


/**
 * Actualizar parcialmente el perfil del usuario autenticado.
 * Envía los cambios mediante PATCH a `/profiles/user/`.
 * (El encabezado Content-Type es gestionado automáticamente por Axios.)
 *
 * @async
 * @function updateProfile
 * @param {Object} profileData - Campos del perfil a actualizar.
 * @returns {Promise<Object>} Perfil actualizado.
 * @throws {Error} Lanza un error si la actualización falla.
 *
 * @example
 * await profileService.updateProfile({ first_name: 'Nahuel', phone: '123456789' });
 */
const updateProfile = (profileData) => {
  return api.patch('/profiles/user/', profileData); // quitar el Content-Type
};


/**
 * Obtener todas las categorías disponibles para los perfiles.
 * Realiza una solicitud GET a `/profiles/categories/`.
 *
 * @async
 * @function getCategories
 * @returns {Promise<Object[]>} Lista de categorías disponibles.
 * @throws {Error} Lanza un error si la obtención falla.
 *
 * @example
 * const categories = await getCategories();
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
 * Obtener los tipos de proveedores registrados en el sistema.
 * Realiza una solicitud GET a `/profiles/type-providers/`.
 *
 * @async
 * @function getTypeProviders
 * @returns {Promise<Object[]>} Lista de tipos de proveedores.
 * @throws {Error} Lanza un error si la obtención falla.
 *
 * @example
 * const types = await getTypeProviders();
 */
export const getTypeProviders = async () => {
  try {
    const response = await api.get('/profiles/type-providers/');
    return response.data;
  } catch (error) {
    console.error('Error fetching type providers:', error);
    throw error;
  }
};


/**
 * Obtener la lista de profesiones registradas.
 * Realiza una solicitud GET a `/profiles/professions/`.
 *
 * @async
 * @function getProfessions
 * @returns {Promise<Object[]>} Lista de profesiones disponibles.
 * @throws {Error} Lanza un error si la obtención falla.
 *
 * @example
 * const professions = await getProfessions();
 */
export const getProfessions = async () => {
  try {
    const response = await api.get('/profiles/professions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching professions:', error);
    throw error;
  }
};

/**
 * Obtener el perfil de un usuario específico (cliente o proveedor).
 * Según el parámetro recibido, consulta `/profiles/user-detail` con
 * el ID correspondiente.
 *
 * @async
 * @function getUserProfile
 * @param {Object} params - Parámetros de búsqueda del perfil.
 * @param {number} [params.id_customer] - ID del cliente (opcional).
 * @param {number} [params.id_provider] - ID del proveedor (opcional).
 * @returns {Promise<Object>} Perfil del usuario solicitado.
 * @throws {Error} Lanza un error si la obtención falla.
 *
 * @example
 * const customerProfile = await getUserProfile({ id_customer: 5 });
 * const providerProfile = await getUserProfile({ id_provider: 12 });
 */
export const getUserProfile = async ({id_customer, id_provider}) => {
  try {
    let url = "/profiles/user-detail";
    
    if (id_customer) {
      url += `?id_customer=${id_customer}`;
    } else if (id_provider) {
      url += `?id_provider=${id_provider}`;
    }

    console.log('getUserProfile called with id_customer:', id_customer, 'id_provider:', id_provider);
    console.log('Making request to:', url);

    const { data } = await api.get(url);

    return data;

  } catch (error) {
    console.error("Error obteniendo perfil de usuario:", error);
    throw error;
  }
};


/**
 * Obtener el perfil de un proveedor específico por su ID.
 * Internamente utiliza `getUserProfile` con `id_provider`.
 *
 * @async
 * @function getProviderProfileById
 * @param {number} providerId - ID del proveedor.
 * @returns {Promise<Object>} Perfil del proveedor.
 * @throws {Error} Lanza un error si la obtención falla.
 *
 * @example
 * const providerProfile = await getProviderProfileById(42);
 */
export const getProviderProfileById = async (providerId) => {
  return getUserProfile({ id_provider: providerId });
};


/**
 * Objeto agrupador del servicio de perfiles.
 * Exporta funciones de uso común para facilitar su importación.
 *
 * @namespace profileService
 * @property {Function} getProfile
 * @property {Function} updateProfile
 * @property {Function} getCategories
 * @property {Function} getTypeProviders
 * @property {Function} getProfessions
 */
export const profileService = {
  getProfile,
  updateProfile,
  getCategories,
  getTypeProviders,
  getProfessions,
};
