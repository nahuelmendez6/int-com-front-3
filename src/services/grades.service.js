import api from './api';

const gradesService = {
  createGrade: async (gradeData) => {
    try {
      const response = await api.post('/grades/', gradeData);
      return response.data;
    } catch (error) {
      console.error("Error al enviar la calificación", error.response?.data || error.message);
      throw error;
    }
  },

  getGradesByProvider: async (providerId) => {
    try {
      const response = await api.get(`/grades/?provider=${providerId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las calificaciones", error.response?.data || error.message);
      throw error;
    }
  },

  getAverageRatingByProvider: async (providerId) => {
    try {
      const response = await api.get(`/grades/average-rating/${providerId}/`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener la calificación promedio", error.response?.data || error.message);
      throw error;
    }
  },
};

export default gradesService;
