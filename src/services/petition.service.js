import { cache } from 'react';
import api from './api.js';
import cacheService from './cache.servie.js';
import retryRequest from './retry.service.js';

export const createPetition = async (petitionData) => {

    try {
        const response = await api.post('/petitions/', petitionData);
        return response.data;
    } catch (error) {
        console.error("Error creating petition", error.response?.data);
        throw error.response?.data || { detail: 'Error creating petition' };
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


export const getPetitionsByCustomer = async (customerId) => {
  try {
    const response = await api.get(`/petitions/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching petitions by customer:', error);
    throw error;
  }
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


export const getPetitions = async () => {
    const cacheKey = cacheService.generateKey('petitions');

    return cacheService.getOrSet(
        cacheKey,
        async () => {
            return retryRequest(async () => {
                const response = await api.get('/petitions/');
                return response.data;
            }, 3, 1000);
        },
        2 * 60 * 1000 // cache por 2 minutos
    );
};

export const getPetition = async (id) => {
  try {
    const response = await api.get(`/petitions/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching petition ${id}:`, error);
    throw error;
  }
};

export const updatePetition = async (id, petitionData) => {
  try {
    const response = await api.patch(`/petitions/${id}/`, petitionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating petition ${id}:`, error.response?.data);
    throw error;
  }
};
