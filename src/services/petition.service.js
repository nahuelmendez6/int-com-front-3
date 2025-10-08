import api from './api.js';

export const createPetition = async (petitionData) => {

    try {
        const response = await api.post('/petitions/', petitionData);
        return response.data;
    } catch (error) {
        console.error("Error creating petition", error.response?.data);
        throw error.response?.data || { detail: 'Error creating petition' };
    }
};

