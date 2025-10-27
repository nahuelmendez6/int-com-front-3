import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import messagesService from '../services/messages.service';

export const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const socket = useRef(null);
  const reconnectTimeout = useRef(null);

  // Conectar WebSocket para mensajes
  const connectSocket = useCallback((conversationId) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const userId = user?.id_user || user?.id;
    
    if (!token || !userId || !conversationId) {
      return;
    }

    // Deshabilitar WebSocket temporalmente si el servidor no está disponible
    const disableWebSocket = localStorage.getItem('disableWebSocket') === 'true';
    if (disableWebSocket) {
      console.log('💬 WebSocket disabled for development');
      return;
    }

    // Cerrar conexión anterior si existe
    if (socket.current) {
      socket.current.close();
    }

    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${conversationId}/`;
    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      console.log('💬 Chat WebSocket connected');
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Received message:', data);
        
        if (data.message && data.sender) {
          const newMessage = {
            id: Date.now(), // ID temporal hasta que el backend devuelva el ID real
            content: data.message,
            sender: data.sender,
            sender_id: data.sender_id,
            created_at: new Date().toISOString(),
            is_read: false,
            is_own: data.sender_id === userId
          };
          
          setMessages(prev => [...prev, newMessage]);
          
          // Mostrar toast si no es el usuario actual
          if (!newMessage.is_own) {
            toast.info(`💬 Nuevo mensaje de ${data.sender}`);
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.current.onclose = (event) => {
      console.log('💬 Chat WebSocket disconnected:', event.code, event.reason);
      
      if (event.code !== 1000) {
        reconnectTimeout.current = setTimeout(() => {
          if (event.code !== 1006) {
            console.log('🔄 Attempting to reconnect chat WebSocket...');
            connectSocket(conversationId);
          }
        }, 3000);
      }
    };

    socket.current.onerror = (error) => {
      if (error.target.readyState === WebSocket.CLOSED) {
        console.log('💬 Chat WebSocket server not available - messages will work when backend is ready');
      } else {
        console.error('💬 Chat WebSocket error:', error);
      }
    };
  }, []);

  // Desconectar WebSocket
  const disconnectSocket = useCallback(() => {
    if (socket.current) {
      socket.current.close(1000, 'User logout');
      socket.current = null;
    }
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
  }, []);

  // Enviar mensaje por WebSocket
  const sendMessage = useCallback(async (content) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({
        message: content
      }));
    } else {
      // Fallback a API REST si WebSocket no está disponible
      try {
        await messagesService.sendMessage(currentConversation.id, content);
        await loadMessages(currentConversation.id);
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Error al enviar el mensaje');
      }
    }
  }, [currentConversation]);

  // Cargar conversaciones
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await messagesService.getConversations();
      setConversations(response.results || response);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Error al cargar las conversaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar mensajes de una conversación
  const loadMessages = useCallback(async (conversationId, page = 1) => {
    try {
      setLoading(true);
      const response = await messagesService.getMessages(conversationId, page);
      setMessages(response.results || response);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Error al cargar los mensajes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      const statsData = await messagesService.getMessageStats();
      setStats(statsData);
      setUnreadCount(statsData.unread_messages || 0);
    } catch (error) {
      console.error('Error loading message stats:', error);
    }
  }, []);

  // Abrir conversación
  const openConversation = useCallback(async (conversation) => {
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);
    connectSocket(conversation.id);
    
    // Marcar mensajes como leídos
    try {
      await messagesService.markMessagesAsRead(conversation.id);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [loadMessages, connectSocket]);

  // Crear nueva conversación
  const createConversation = useCallback(async (participantId) => {
    try {
      const conversation = await messagesService.createConversation(participantId);
      await loadConversations();
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Error al crear la conversación');
      throw error;
    }
  }, [loadConversations]);

  // Buscar conversaciones
  const searchConversations = useCallback(async (query) => {
    try {
      const response = await messagesService.searchConversations(query);
      return response;
    } catch (error) {
      console.error('Error searching conversations:', error);
      toast.error('Error al buscar conversaciones');
      return [];
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadStats();
      loadConversations();
    }
  }, [loadStats, loadConversations]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  return {
    conversations,
    currentConversation,
    messages,
    unreadCount,
    loading,
    stats,
    connectSocket,
    disconnectSocket,
    loadConversations,
    loadMessages,
    loadStats,
    openConversation,
    createConversation,
    sendMessage,
    searchConversations
  };
};
