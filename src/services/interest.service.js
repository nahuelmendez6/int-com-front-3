import api from './api';

export const getCategories = () => {
  return api.get('/profiles/categories/');
};

export const saveInterest = (id_customer, id_category) => {
  return api.post('/interests/', { id_customer, id_category });
};

export const getInterestsByCustomer = (id_customer) => {
  return api.get(`/interests/?id_customer=${id_customer}`);
};

export const deleteInterest = (interestId) => {
  return api.delete(`/interests/${interestId}/`);
};
