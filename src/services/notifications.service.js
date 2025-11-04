// src/services/notifications.service.js
// =====================================================
//  Servicio de Notificaciones (Notifications Service)
// -----------------------------------------------------
// Gestiona todas las operaciones relacionadas con las notificaciones del usuario:
// obtención, estadísticas, lectura, configuración y eliminación.
// =====================================================
import api from './api';

export const notificationsService = {
  // =====================================================
  // Obtener notificaciones
  // =====================================================

  /**
   * Obtener todas las notificaciones del usuario autenticado.
   * @param {number} [page=1] - Página de resultados (paginación).
   * @param {number} [limit=20] - Límite de notificaciones por página.
   * @returns {Promise<Object>} Lista de notificaciones.
   */
  async getNotifications(page = 1, limit = 20) {
    try {
      const response = await api.get(`/notifications/?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },


  /**
   * Obtener estadísticas generales de las notificaciones (leídas, no leídas, etc.).
   * @returns {Promise<Object>} Datos estadísticos de notificaciones.
   */
  async getNotificationStats() {
    try {
      const response = await api.get('/notifications/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  },


  // =====================================================
  //  Lectura de notificaciones
  // =====================================================

  /**
   * Marcar una notificación específica como leída.
   * @param {number|string} notificationId - ID de la notificación.
   * @returns {Promise<Object>} Notificación actualizada.
   */
  async markAsRead(notificationId) {
    try {
      const response = await api.post(`/notifications/${notificationId}/mark-read/`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Marcar todas las notificaciones del usuario como leídas.
   * @returns {Promise<Object>} Resultado de la operación.
   */
  async markAllAsRead() {
    try {
      const response = await api.post('/notifications/mark-all-read/');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // =====================================================
  //  Configuración de notificaciones
  // =====================================================

  /**
   * Obtener la configuración actual de notificaciones del usuario.
   * @returns {Promise<Object>} Configuración del usuario.
   */
  async getNotificationSettings() {
    try {
      const response = await api.get('/notifications/settings/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  },


  /**
   * Actualizar la configuración de notificaciones del usuario.
   * @param {Object} settings - Nuevos valores de configuración.
   * @returns {Promise<Object>} Configuración actualizada.
   */
  async updateNotificationSettings(settings) {
    try {
      const response = await api.put('/notifications/settings/', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  },

  // =====================================================
  // 🗑️ Eliminación
  // =====================================================

  /**
   * Eliminar una notificación específica del usuario.
   * @param {number|string} notificationId - ID de la notificación a eliminar.
   * @returns {Promise<Object>} Respuesta del servidor.
   */
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
