// Importa hooks de React para manejar estado, efectos y memorizar funciones.
import { useState, useEffect, useCallback } from 'react';

// Importa toast para mostrar notificaciones al usuario.
import { toast } from 'react-toastify';


// Importa el servicio que maneja todas las operaciones relacionadas con mensajes y conversaciones.
import messagesService from '../services/messages.service';


// Hook personalizado: useMessages
// Este hook gestiona todo el flujo de mensajes y conversaciones para un usuario.
// Incluye: lista de conversaciones, mensajes por conversación, envío, lectura,
// búsqueda, estadísticas y polling simple para actualizaciones.
export const useMessages = () => {
  // Lista de conversaciones del usuario.
  const [conversations, setConversations] = useState([]);
  
  // Conversación actualmente abierta.
  const [currentConversation, setCurrentConversation] = useState(null);

  // Lista de mensajes de la conversación abierta.
  const [messages, setMessages] = useState([]);

  // Cantidad total de mensajes no leídos en todas las conversaciones.
  const [unreadCount, setUnreadCount] = useState(0);

   // Estado de carga para mostrar spinner o bloquear UI.
  const [loading, setLoading] = useState(false);

  // Estadísticas adicionales (pueden ser usadas para dashboards, badges, etc.).
  const [stats, setStats] = useState(null);
   // WebSocket no implementado: funciones vacías para compatibilidad.
  const connectSocket = useCallback(() => {}, []);
  const disconnectSocket = useCallback(() => {}, []);

  // Función para enviar un mensaje en la conversación abierta.
  const sendMessage = useCallback(async (content) => {
    try {
      const convId = currentConversation?.id || currentConversation?.id_conversation || currentConversation?.conversation_id;
      if (!convId) {
        toast.error('Conversación inválida');
        return;
      }
      await messagesService.sendMessage(convId, content);
      await loadMessages(convId);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar el mensaje');
    }
  }, [currentConversation]);

  // Función para cargar todas las conversaciones del usuario.
  const loadConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      setLoading(true);
      const data = await messagesService.getConversations();

      // Normaliza el formato de la lista de conversaciones.
      const list = Array.isArray(data) ? data : (data.results || []);
      setConversations(list);

       // Calcula la cantidad total de mensajes no leídos.
      const totalUnread = list.reduce((acc, c) => acc + (c.unread_count || 0), 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      if (error?.response?.status === 401) {
        // usuario no autenticado; ignorar en logout
        return;
      }
      console.error('Error loading conversations:', error);
      toast.error('Error al cargar las conversaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para cargar mensajes de una conversación específica.
  const loadMessages = useCallback(async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      setLoading(true);
      const data = await messagesService.getMessages(conversationId);

      // Identifica el usuario actual para marcar mensajes propios
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      const userId = user?.id_user || user?.id;
      const list = Array.isArray(data) ? data : (data.results || []);
      const normalized = list.map((m) => ({
        ...m,
        is_own: m?.sender?.id_user ? (m.sender.id_user === userId) : m?.sender_id ? (m.sender_id === userId) : false,
      }));
      setMessages(normalized);
    } catch (error) {
      if (error?.response?.status === 401) {
        return;
      }
      console.error('Error loading messages:', error);
      toast.error('Error al cargar los mensajes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para cargar estadísticas (placeholder, puede ser extendida).
  const loadStats = useCallback(async () => {
    setStats(null);
  }, []);

  // Abrir una conversación específica.
  // Carga los mensajes, marca como leídos y actualiza la lista de conversaciones.
  const openConversation = useCallback(async (conversation) => {
    const convId = conversation?.id || conversation?.id_conversation || conversation?.conversation_id;
    if (!convId) {
      console.error('openConversation: invalid conversation id', conversation);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    setCurrentConversation({ ...conversation, id: convId });
    await loadMessages(convId);
    
    // Marcar mensajes como leídos
    try {
      await messagesService.markMessagesAsRead(convId);
      await loadConversations();
    } catch (error) {
      // Puede fallar 404 si aún no está disponible; evitar ruido
      if (error?.response?.status !== 404) {
        console.error('Error marking messages as read:', error);
      }
    }
  }, [loadMessages]);

  // Crear nueva conversación
  const createConversation = useCallback(async (participantId) => {
    try {
      const conversation = await messagesService.startConversation(participantId);
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

  // Polling simple cuando hay una conversación abierta (sin WebSockets)
  useEffect(() => {
    const convId = currentConversation?.id || currentConversation?.id_conversation || currentConversation?.conversation_id;
    if (!convId) return;
    const interval = setInterval(async () => {
      try {
        await loadMessages(convId);
        await loadConversations();
      } catch (_) {
        // Evitar ruido; typical transient errors
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentConversation, loadMessages, loadConversations]);

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
