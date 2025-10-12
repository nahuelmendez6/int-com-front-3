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

export const getPostulationsByPetition = async (petitionId) => {
  try {
    const response = await api.get(`/postulations/by-petition/${petitionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching postulations for petition ${petitionId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const updatePostulation = async (postulationId, data) => {
  try {
    console.log('Sending data to update postulation:', JSON.stringify(data, null, 2));
    const response = await api.patch(`/postulations/${postulationId}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating postulation ${postulationId}:`, error.response?.data || error.message);
    throw error;
  }
};
