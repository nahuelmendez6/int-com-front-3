import api from './api';

const getProfile = () => {
  return api.get('/profiles/');
};

const updateProfile = (profileData) => {
  return api.patch('/profiles/user/', profileData); // quitar el Content-Type
};



export const getCategories = async () => {
  try {
    const response = await api.get('/profiles/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getTypeProviders = async () => {
  try {
    const response = await api.get('/profiles/type-providers/');
    return response.data;
  } catch (error) {
    console.error('Error fetching type providers:', error);
    throw error;
  }
};

export const getProfessions = async () => {
  try {
    const response = await api.get('/profiles/professions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching professions:', error);
    throw error;
  }
};

export const getUserProfile = async ({id_customer, id_provider}) => {
  try {
    const params = {};

    if (id_customer) params.id_customer = id_customer;
    if (id_provider) params.id_provider = id_provider;

    const { data } = await api.get("/profiles/user-detail/", { params });

    return data;

  } catch (error) {
    console.error("Error obteniendo perfil de usuario:", error);
    throw error;
  }
};

export const getProviderProfileById = async (providerId) => {
  return getUserProfile({ id_provider: providerId });
};

export const profileService = {
  getProfile,
  updateProfile,
  getCategories,
  getTypeProviders,
  getProfessions,
};
