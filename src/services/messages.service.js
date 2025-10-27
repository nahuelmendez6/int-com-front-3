// src/services/messages.service.js
import api from './api';

const messagesService = {
  // Obtener todas las conversaciones del usuario
  async getConversations() {
    try {
      const response = await api.get('/conversations/');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Obtener mensajes de una conversación específica
  // NOTA: Este endpoint necesita ser implementado en el backend
  async getMessages(conversationId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/conversations/${conversationId}/send_message/?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Crear una nueva conversación
  async createConversation(participantId) {
    try {
      const response = await api.post('/conversations/', {
        participant_id: participantId,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  // Enviar un mensaje
  // NOTA: Este endpoint necesita ser implementado en el backend
  async sendMessage(conversationId, content) {
    try {
      const response = await api.post(`/conversations/${conversationId}/send_message/`, {
        content,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Marcar mensajes como leídos
  // NOTA: Este endpoint necesita ser implementado en el backend
  async markMessagesAsRead(conversationId) {
    try {
      const response = await api.post(`/conversations/${conversationId}/mark_read/`);
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  // Obtener estadísticas de mensajes
  // NOTA: Este endpoint necesita ser implementado en el backend
  async getMessageStats() {
    try {
      const response = await api.get('/conversations/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching message stats:', error);
      throw error;
    }
  },

  // Buscar conversaciones
  // NOTA: Este endpoint necesita ser implementado en el backend
  async searchConversations(query) {
    try {
      const response = await api.get(`/conversations/search/?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw error;
    }
  },
};

export default messagesService;
