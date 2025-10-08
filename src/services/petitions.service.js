import api from './api';

export const getPetitions = async () => {
  try {
    const response = await api.get('/petitions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching petitions:', error);
    throw error;
  }
};

export const createPetition = async (petitionData) => {
  try {
    const response = await api.post('/petitions/', petitionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating petition:', error);
    throw error;
  }
};

export const getPetitionTypes = async () => {
  try {
    const response = await api.get('/petitions/type-petitions/');
    return response.data;
  } catch (error) {
    console.error('Error fetching petition types:', error);
    throw error;
  }
};

export const updatePetition = async (id, petitionData) => {
  try {
    const response = await api.patch(`/petitions/${id}/`, petitionData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating petition:', error);
    throw error;
  }
};

export const deletePetition = async (id) => {
  try {
    const response = await api.patch(`/petitions/${id}/`, { is_deleted: true });
    return response.data;
  } catch (error) {
    console.error('Error deleting petition:', error);
    throw error;
  }
};
