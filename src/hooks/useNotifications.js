import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import notificationsService from '../services/notifications.service';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const socket = useRef(null);
  const reconnectTimeout = useRef(null);

  // Conectar WebSocket
  const connectSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const userId = user?.id_user || user?.id; // Usar id_user si existe, sino id como fallback
    
    // Deshabilitar WebSocket temporalmente si el servidor no está disponible
    const disableWebSocket = localStorage.getItem('disableWebSocket') === 'true';
    if (disableWebSocket) {
      console.log('🔔 WebSocket disabled for development');
      return;
    }
    
    if (!token || !userId || (socket.current && socket.current.readyState === WebSocket.OPEN)) {
      return;
    }

    // Cerrar conexión anterior si existe
    if (socket.current) {
      socket.current.close();
    }

    const wsUrl = `ws://127.0.0.1:8000/ws/notifications/${userId}/`;
    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      console.log('🔔 Notification WebSocket connected');
      // Limpiar timeout de reconexión si existe
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Received notification:', data);
        
        switch (data.type) {
          case 'connection_established':
            setUnreadCount(data.unread_count || 0);
            break;
            
          case 'notification_created':
            const newNotification = {
              ...data.notification,
              id: data.notification.id,
              is_read: data.notification.is_read,
              created_at: data.notification.created_at,
              time_ago: data.notification.time_ago
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(data.unread_count || 0);
            
            // Mostrar toast según el tipo
            showNotificationToast(newNotification);
            break;
            
          case 'notification_updated':
            setNotifications(prev => 
              prev.map(notif => 
                notif.id === data.notification.id ? { ...notif, ...data.notification } : notif
              )
            );
            setUnreadCount(data.unread_count || 0);
            break;
            
          case 'notification_deleted':
            setNotifications(prev => 
              prev.filter(notif => notif.id !== data.notification_id)
            );
            setUnreadCount(data.unread_count || 0);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.current.onclose = (event) => {
      // Solo mostrar logs en desarrollo si el servidor está disponible
      if (event.code !== 1000 && event.code !== 1006) {
        console.log('🔔 Notification WebSocket disconnected:', event.code, event.reason);
      }
      
      // Reconectar automáticamente después de 3 segundos si no fue un cierre intencional
      if (event.code !== 1000) {
        reconnectTimeout.current = setTimeout(() => {
          // Solo intentar reconectar si no es un error de conexión
          if (event.code !== 1006) {
            console.log('🔄 Attempting to reconnect WebSocket...');
            connectSocket();
          }
        }, 3000);
      }
    };

    socket.current.onerror = (error) => {
      // Solo mostrar errores si no es un error de conexión (servidor no disponible)
      if (error.target.readyState === WebSocket.CLOSED) {
        console.log('🔔 WebSocket server not available - notifications will work when backend is ready');
      } else {
        console.error('🔔 Notification WebSocket error:', error);
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

  // Mostrar toast de notificación
  const showNotificationToast = (notification) => {
    const { notification_type, title, message } = notification;
    
    switch (notification_type) {
      case 'postulation_created':
        toast.info(`🔔 ${title}: ${message}`);
        break;
      case 'postulation_accepted':
        toast.success(`✅ ${title}: ${message}`);
        break;
      case 'postulation_rejected':
        toast.error(`❌ ${title}: ${message}`);
        break;
      case 'postulation_state_changed':
        toast.info(`📝 ${title}: ${message}`);
        break;
      case 'petition_closed':
        toast.warning(`🔒 ${title}: ${message}`);
        break;
      default:
        toast(`🔔 ${title}: ${message}`);
        break;
    }
  };

  // Cargar notificaciones desde la API
  const loadNotifications = useCallback(async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await notificationsService.getNotifications(page, limit);
      setNotifications(response.results || response);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      const statsData = await notificationsService.getNotificationStats();
      setStats(statsData);
      setUnreadCount(statsData.unread_notifications || 0);
    } catch (error) {
      console.error('Error loading notification stats:', error);
    }
  }, []);

  // Marcar notificación como leída
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Error al marcar la notificación como leída');
    }
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Error al marcar todas las notificaciones como leídas');
    }
  }, []);

  // Enviar comando por WebSocket
  const sendWebSocketCommand = useCallback((command) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(command));
    }
  }, []);

  // Marcar como leída vía WebSocket
  const markAsReadWebSocket = useCallback((notificationId) => {
    sendWebSocketCommand({
      type: 'mark_as_read',
      notification_id: notificationId
    });
  }, [sendWebSocketCommand]);

  // Obtener conteo de no leídas vía WebSocket
  const getUnreadCountWebSocket = useCallback(() => {
    sendWebSocketCommand({
      type: 'get_unread_count'
    });
  }, [sendWebSocketCommand]);

  // Cargar datos iniciales
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadStats();
      loadNotifications();
    }
  }, [loadStats, loadNotifications]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  return {
    notifications,
    unreadCount,
    loading,
    stats,
    connectSocket,
    disconnectSocket,
    loadNotifications,
    loadStats,
    markAsRead,
    markAllAsRead,
    markAsReadWebSocket,
    getUnreadCountWebSocket,
    sendWebSocketCommand
  };
};
