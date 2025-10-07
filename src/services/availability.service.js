import api from './api.js'




export const getProviderAvailability = async (providerId) => {
  try {
    const response = await api.get(`/availability/provider/${providerId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching provider availability:', error);
    throw error;
  }
};

export const updateProviderAvailability = async (availabilityData) => {
  try {
    // The backend endpoint is /availability/add/, let's use that.
    // We might need to clarify if this endpoint handles both add and update.
    // For now, we assume it can be used to overwrite or add new slots.
    const response = await api.post('/availability/add/', availabilityData);
    return response.data;
  } catch (error) {
    console.error('Error updating provider availability:', error.response?.data || error);
    throw error;
  }
};

export const deleteProviderAvailability = async (availabilityId) => {
  try {
    const response = await api.delete(`/availability/edit/${availabilityId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting provider availability:', error.response?.data || error);
    throw error;
  }
};

export const editProviderAvailability = async (availabilityId, availabilityData) => {
  try {
    const response = await api.patch(`/availability/edit/${availabilityId}/`, availabilityData);
    return response.data;
  } catch (error) {
    console.error('Error editing provider availability:', error.response?.data || error);
    throw error;
  }
};
