// src/services/notifications.service.js
import api from './api';

export const notificationsService = {
  // Obtener todas las notificaciones del usuario
  async getNotifications(page = 1, limit = 20) {
    try {
      const response = await api.get(`/notifications/?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Obtener estadísticas de notificaciones
  async getNotificationStats() {
    try {
      const response = await api.get('/notifications/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  },

  // Marcar una notificación como leída
  async markAsRead(notificationId) {
    try {
      const response = await api.post(`/notifications/${notificationId}/mark-read/`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Marcar todas las notificaciones como leídas
  async markAllAsRead() {
    try {
      const response = await api.post('/notifications/mark-all-read/');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Obtener configuración de notificaciones del usuario
  async getNotificationSettings() {
    try {
      const response = await api.get('/notifications/settings/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },

  // Actualizar configuración de notificaciones
  async updateNotificationSettings(settings) {
    try {
      const response = await api.put('/notifications/settings/', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  // Eliminar una notificación
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};

export default notificationsService;
