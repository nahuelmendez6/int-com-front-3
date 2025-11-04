// src/services/messages.service.js
// =====================================================
// Servicio de Mensajería (Messages Service)
// -----------------------------------------------------
// Este servicio gestiona todas las operaciones del sistema de chat:
// conversaciones, mensajes, envío, lectura y creación de conversaciones.
// Todas las peticiones se realizan mediante la API de chat del backend.
// =====================================================
import api from './api';

const BASE = '/api/chat';

const messagesService = {
  // =====================================================
  //  Conversaciones
  // =====================================================

  /**
   * Obtener todas las conversaciones del usuario autenticado.
   * @returns {Promise<Object[]>} Lista de conversaciones activas.
   */
  async getConversations() {
    const response = await api.get(`${BASE}/conversations/`);
    return response.data;
  },

  /**
   * Obtener los mensajes dentro de una conversación específica.
   * @param {number|string} conversationId - ID de la conversación.
   * @returns {Promise<Object[]>} Lista de mensajes en la conversación.
   */
  async getMessages(conversationId) {
    const response = await api.get(`${BASE}/conversations/${conversationId}/`);
    return response.data;
  },

  /**
   * Iniciar o recuperar una conversación existente con un usuario.
   * Si ya existe una conversación previa, la devuelve; de lo contrario, la crea.
   * @param {number|string} userId - ID del usuario con quien chatear.
   * @returns {Promise<Object>} Datos de la conversación iniciada o existente.
   */
  async startConversation(userId) {
    const response = await api.post(`${BASE}/conversations/start/`, { user_id: userId });
    return response.data;
  },

  // =====================================================
  // Mensajes
  // =====================================================

  /**
   * Enviar un nuevo mensaje dentro de una conversación.
   * @param {number|string} conversationId - ID de la conversación.
   * @param {string} content - Contenido textual del mensaje.
   * @returns {Promise<Object>} Mensaje enviado.
   */
  async sendMessage(conversationId, content) {
    const response = await api.post(`${BASE}/conversations/${conversationId}/send/`, { content });
    return response.data;
  },

  /**
   * Marcar todos los mensajes como leídos en una conversación.
   * @param {number|string} conversationId - ID de la conversación.
   * @returns {Promise<Object>} Respuesta del servidor.
   */
  async markMessagesAsRead(conversationId) {
    const response = await api.patch(`${BASE}/conversations/${conversationId}/mark_as_read/`, {});
    return response.data;
  },
};

export default messagesService;
