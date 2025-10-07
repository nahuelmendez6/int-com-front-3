import api from './api';

// Devuelve todas las ofertas asociadas al proveedor autenticado
export const getOffers = () => {
  return api.get('/offers/');
};

// Crea una nueva oferta para el proveedor autenticado
export const createOffer = (offerData) => {
  return api.post('/offers/', offerData);
};

// Actualiza una oferta existente
export const updateOffer = (offerId, offerData) => {
  return api.put(`/offers/${offerId}/`, offerData);
};

// Realiza un soft delete de una oferta
export const deleteOffer = (offerId) => {
  return api.patch(`/offers/${offerId}/`, { is_deleted: true });
};

// Devuelve los tipos de oferta disponibles
export const getOfferTypes = () => {
  return api.get('/offers/type-offers/');
};

