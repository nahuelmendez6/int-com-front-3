// src/services/messages.service.js
import api from './api';

const BASE = '/api/chat';

const messagesService = {
  // Listar conversaciones del usuario autenticado
  async getConversations() {
    const response = await api.get(`${BASE}/conversations/`);
    return response.data;
  },

  // Ver mensajes de una conversación
  async getMessages(conversationId) {
    const response = await api.get(`${BASE}/conversations/${conversationId}/`);
    return response.data;
  },

  // Iniciar o recuperar una conversación con un usuario
  async startConversation(userId) {
    const response = await api.post(`${BASE}/conversations/start/`, { user_id: userId });
    return response.data;
  },

  // Enviar mensaje en una conversación
  async sendMessage(conversationId, content) {
    const response = await api.post(`${BASE}/conversations/${conversationId}/send/`, { content });
    return response.data;
  },

  // Marcar mensajes como leídos en una conversación
  async markMessagesAsRead(conversationId) {
    const response = await api.patch(`${BASE}/conversations/${conversationId}/mark_as_read/`, {});
    return response.data;
  },
};

export default messagesService;
