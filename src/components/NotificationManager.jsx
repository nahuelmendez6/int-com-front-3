import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotificationContext } from '../contexts/NotificationContext.jsx';

const NotificationManager = () => {
  const { user } = useAuth();
  const { connectSocket, disconnectSocket } = useNotificationContext();

  useEffect(() => {
    if (user) {
      // Conectar WebSocket cuando el usuario esté autenticado
      connectSocket();
    } else {
      // Desconectar WebSocket cuando el usuario no esté autenticado
      disconnectSocket();
    }

    // Cleanup al desmontar
    return () => {
      disconnectSocket();
    };
  }, [user, connectSocket, disconnectSocket]);

  return null; // Este componente no renderiza nada
};

export default NotificationManager;
