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

// Elimina una oferta
export const deleteOffer = (offerId) => {
  return api.delete(`/offers/${offerId}/`);
};
