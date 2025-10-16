import React from 'react';
import { useNotificationContext } from '../../contexts/NotificationContext.jsx';
import './Notifications.css';

const NotificationIcon = ({ onClick }) => {
  const { unreadCount } = useNotificationContext();

  return (
    <button onClick={onClick} className="notification-icon">
      <i className="fas fa-bell"></i>
      {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
    </button>
  );
};

export default NotificationIcon;
