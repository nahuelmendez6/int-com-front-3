import React from 'react';
import { useNotificationContext } from '../../contexts/NotificationContext.jsx';
import './Notifications.css';

const NotificationPanel = ({ isOpen }) => {
  const { notifications, markAllAsRead } = useNotificationContext();

  if (!isOpen) return null;

  const getNotificationTypeStyle = (type) => {
    switch (type) {
      case 'new_postulation':
        return 'info';
      case 'postulation_accepted':
        return 'success';
      case 'postulation_rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h3>Notificaciones</h3>
        <button onClick={markAllAsRead} className="mark-as-read-btn">
          Marcar todas como leídas
        </button>
      </div>
      <div className="panel-body">
        {notifications.length === 0 ? (
          <p className="no-notifications">No hay notificaciones</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`notification-item ${getNotificationTypeStyle(notif.type)} ${!notif.read ? 'unread' : ''}`}>
              <div className="item-header">
                <strong>{notif.title}</strong>
                <span className="item-date">{new Date(notif.created_at).toLocaleString()}</span>
              </div>
              <p className="item-message">{notif.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
