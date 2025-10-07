import api from './api';

const getProfile = () => {
  return api.get('/profiles/');
};

const updateProfile = (profileData) => {
  return api.patch('/profiles/user/', profileData, {
    headers: { "Content-Type": "application/json" }
  });
};


const getCategories = () => {
  return api.get('/profiles/categories/');
};

const getTypeProviders = () => {
  return api.get('/profiles/type-providers/');
};

const getProfessions = () => {
  return api.get('/profiles/professions/');
};

export const profileService = {
  getProfile,
  updateProfile,
  getCategories,
  getTypeProviders,
  getProfessions,
};
