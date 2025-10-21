import api from './api';

export const createPostulation = async (postulationData) => {
  try {
    const response = await api.post('/postulations/', postulationData);
    return response.data;
  } catch (error) {
    console.error('Error creating postulation:', error.response.data);
    throw error;
  }
};

export const getPostulationsByPetition = async (petitionId) => {
  try {
    const response = await api.get(`/petitions/${petitionId}/postulations/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching postulations:', error.response.data);
    throw error;
  }
};

export const getProviderPostulations = async () => {
  try {
    const response = await api.get('/postulations/');
    return response.data;
  } catch (error) {
    console.error('Error fetching provider postulations:', error.response.data);
    throw error;
  }
};

export const updatePostulation = async (postulationId, data) => {
  try {
    const response = await api.patch(`/postulations/${postulationId}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating postulation:', error.response.data);
    throw error;
  }
};

export const acceptPostulation = async (postulationId) => {
  try {
    const response = await api.post(`/postulations/${postulationId}/accept/`);
    return response.data;
  } catch (error) {
    console.error('Error accepting postulation:', error.response.data);
    throw error;
  }
};