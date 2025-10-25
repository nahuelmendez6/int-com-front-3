import React from 'react';
import { useNotificationContext } from '../../contexts/NotificationContext.jsx';
import './Notifications.css';

const NotificationIcon = ({ onClick, className = '' }) => {
  const { unreadCount } = useNotificationContext();

  return (
    <button 
      onClick={onClick} 
      className={`notification-icon ${className}`}
      title={`${unreadCount} notificaciones no leídas`}
    >
      <i className="bi bi-bell"></i>
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationIcon;
