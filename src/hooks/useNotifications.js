import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useRef(null);

  const connectSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token || (socket.current && socket.current.readyState === WebSocket.OPEN)) {
      return;
    }

    const wsUrl = `ws://localhost:8000/ws/notifications/?token=${token}`;
    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      console.log('Notification WebSocket connected');
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      const newNotification = { ...data, read: false, id: data.id || new Date().getTime() };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);

      switch (newNotification.type) {
        case 'new_postulation':
          toast.info(newNotification.message);
          break;
        case 'postulation_accepted':
          toast.success(newNotification.message);
          break;
        case 'postulation_rejected':
          toast.error(newNotification.message);
          break;
        default:
          toast(newNotification.message);
          break;
      }
    };

    socket.current.onclose = () => {
      console.log('Notification WebSocket disconnected');
      // Optional: implement reconnection logic here
    };

    socket.current.onerror = (error) => {
      console.error('Notification WebSocket error:', error);
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };
  
  useEffect(() => {
    // Automatically connect when the hook is first used, e.g. in the context
    // connectSocket();

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [connectSocket]);

  return { notifications, unreadCount, markAllAsRead, connectSocket };
};
