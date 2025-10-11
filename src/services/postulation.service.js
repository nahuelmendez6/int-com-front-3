import api from './api';

export const createPostulation = async (postulationData) => {
  try {
    const response = await api.post('/postulations/', postulationData);
    return response.data;
  } catch (error) {
    console.error('Error creating postulation:', error.response?.data || error.message);
    throw error;
  }
};
