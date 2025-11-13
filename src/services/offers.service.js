// src/services/offers.service.js
// =====================================================
// Servicio de Ofertas (Offers Service)
// -----------------------------------------------------
// Este módulo centraliza todas las operaciones relacionadas con
// la gestión de ofertas dentro de la aplicación. Proporciona funciones
// para crear, actualizar, eliminar (soft delete) y obtener ofertas,
// así como para consultar los tipos de oferta y el feed de ofertas
// para los clientes autenticados.
// =====================================================


import api from './api';

/**
 * Obtener todas las ofertas asociadas al proveedor autenticado.
 * Realiza una petición GET al endpoint `/offers/`.
 * 
 * @async
 * @function getOffers
 * @returns {Promise<Object[]>} Promesa que resuelve con un arreglo de objetos de ofertas.
 * 
 * @example
 * const offers = await getOffers();
 * console.log(offers);
 */
export const getOffers = () => {
  return api.get('/offers/');
};

/**
 * Crear una nueva oferta asociada al proveedor autenticado.
 * Envía los datos de la oferta mediante una petición POST a `/offers/`.
 * 
 * @async
 * @function createOffer
 * @param {Object} offerData - Datos de la oferta a crear (título, descripción, precio, etc.).
 * @returns {Promise<Object>} Promesa que resuelve con los datos de la oferta creada.
 * 
 * @example
 * const newOffer = await createOffer({ title: 'Oferta Especial', price: 100 });
 */
export const createOffer = (offerData) => {
  return api.post('/offers/', offerData);
};

/**
 * Actualizar una oferta existente.
 * Realiza una petición PATCH al endpoint `/offers/{offerId}/` con los datos actualizados.
 * 
 * @async
 * @function updateOffer
 * @param {number|string} offerId - ID de la oferta a actualizar.
 * @param {Object} offerData - Datos modificados de la oferta.
 * @returns {Promise<Object>} Promesa que resuelve con los datos actualizados de la oferta.
 * 
 * @example
 * await updateOffer(5, { price: 120, description: 'Nuevo precio de oferta' });
 */
export const updateOffer = (offerId, offerData) => {
  return api.patch(`/offers/${offerId}/`, offerData);
};

/**
 * Eliminar una oferta (soft delete).
 * En lugar de eliminarla definitivamente, marca la oferta como `is_deleted: true`.
 * Realiza una petición PATCH al endpoint `/offers/{offerId}/`.
 * 
 * @async
 * @function deleteOffer
 * @param {number|string} offerId - ID de la oferta a marcar como eliminada.
 * @returns {Promise<Object>} Promesa que resuelve con la respuesta del servidor.
 * 
 * @example
 * await deleteOffer(7);
 */
export const deleteOffer = (offerId) => {
  return api.patch(`/offers/${offerId}/`, { is_deleted: true });
};

/**
 * Obtener los tipos de oferta disponibles.
 * Ideal para rellenar menús desplegables o formularios de creación/edición.
 * 
 * @async
 * @function getOfferTypes
 * @returns {Promise<Object[]>} Promesa que resuelve con la lista de tipos de oferta.
 * 
 * @example
 * const types = await getOfferTypes();
 * console.log(types);
 */
export const getOfferTypes = () => {
  return api.get('/offers/type-offers/');
};

/**
 * Obtener el feed de ofertas destinado a los clientes autenticados.
 * Este endpoint devuelve las ofertas visibles públicamente o recomendadas.
 * 
 * @async
 * @function getCustomerFeedOffers
 * @returns {Promise<Object[]>} Promesa que resuelve con la lista de ofertas del feed del cliente.
 * 
 * @example
 * const feed = await getCustomerFeedOffers();
 * console.log(feed);
 */
export const getCustomerFeedOffers = () => {
  return api.get('/offers/customer-feed/');
};

