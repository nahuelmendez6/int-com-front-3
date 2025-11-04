/**
 * Componente: NotificationPanel
 * 
 * Descripción:
 * ---------------
 * Este componente representa el **panel lateral de notificaciones** de la aplicación.
 * Se encarga de mostrar la lista de notificaciones del usuario, con sus estados 
 * (leídas/no leídas), tipos e íconos correspondientes.
 * 
 * También permite realizar acciones como:
 * - Marcar notificaciones como leídas (individualmente o todas a la vez).
 * - Cargar más notificaciones paginadas.
 * - Cerrar el panel.
 * 
 * Props:
 * -------
 * - `isOpen` (boolean): Indica si el panel está visible o no.
 * - `onClose` (function): Función que se ejecuta al hacer clic en el botón de cierre.
 * 
 * Contextos utilizados:
 * ----------------------
 * - `useNotificationContext()`:
 *    - `notifications`: Lista de notificaciones cargadas.
 *    - `unreadCount`: Número total de notificaciones no leídas.
 *    - `loading`: Indica si las notificaciones se están cargando.
 *    - `markAsRead(id)`: Marca una notificación como leída.
 *    - `markAllAsRead()`: Marca todas las notificaciones como leídas.
 *    - `loadNotifications(page)`: Carga una página de notificaciones.
 * 
 * Funcionalidades clave:
 * -----------------------
 * - Carga automática de notificaciones al abrir el panel.
 * - Diferenciación visual de tipos de notificación mediante colores e íconos.
 * - Control de paginación (botón “Cargar más”).
 * - Formateo de tiempo relativo (“Hace 5 minutos”, “Hace 2 días”, etc.).
 * 
 * Archivos relacionados:
 * -----------------------
 * - `NotificationContext.jsx`: Define la lógica global de notificaciones.
 * - `Notifications.css`: Contiene los estilos de este panel y sus elementos.
 */

import React, { useState, useEffect } from 'react';
import { useNotificationContext } from '../../contexts/NotificationContext.jsx';
import './Notifications.css';

const NotificationPanel = ({ isOpen, onClose }) => {
   // --- Contexto global de notificaciones ---
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead,
    loadNotifications 
  } = useNotificationContext();

  // --- Estados locales ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // --- Efecto: cargar notificaciones al abrir el panel ---
  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      loadNotifications();
    }
  }, [isOpen, notifications.length, loadNotifications]);

   // Si el panel está cerrado, no renderizar nada
  if (!isOpen) return null;

  // --- Determina el estilo según el tipo de notificación ---
  const getNotificationTypeStyle = (type) => {
    switch (type) {
      case 'postulation_created':
        return 'info';
      case 'postulation_accepted':
        return 'success';
      case 'postulation_rejected':
        return 'danger';
      case 'postulation_state_changed':
        return 'warning';
      case 'petition_closed':
        return 'secondary';
      default:
        return 'default';
    }
  };

   // --- Determina el ícono correspondiente al tipo ---
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'postulation_created':
        return 'bi-person-plus';
      case 'postulation_accepted':
        return 'bi-check-circle';
      case 'postulation_rejected':
        return 'bi-x-circle';
      case 'postulation_state_changed':
        return 'bi-arrow-repeat';
      case 'petition_closed':
        return 'bi-lock';
      default:
        return 'bi-bell';
    }
  };

   // --- Marca una notificación como leída al hacer clic ---
  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
  };

   // --- Carga más notificaciones (paginación) ---
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadNotifications(nextPage);
  };

  // --- Formatea el tiempo relativo ("Hace 2 horas", etc.) ---
  const formatTimeAgo = (timeAgo) => {
    if (timeAgo) return timeAgo;
    
    // Fallback si no hay time_ago
    const date = new Date(notifications.created_at);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minutos`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} horas`;
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h3>
          Notificaciones 
          {unreadCount > 0 && (
            <span className="unread-count">({unreadCount} no leídas)</span>
          )}
        </h3>
        <div className="panel-actions">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="mark-as-read-btn">
              <i className="bi bi-check-all me-1"></i>
              Marcar todas como leídas
            </button>
          )}
          <button onClick={onClose} className="close-btn">
            <i className="bi bi-x"></i>
          </button>
        </div>
      </div>
      
      <div className="panel-body">
        {loading && notifications.length === 0 ? (
          <div className="loading-notifications">
            <i className="bi bi-hourglass-split"></i>
            <p>Cargando notificaciones...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="no-notifications">
            <i className="bi bi-bell-slash"></i>
            <p>No hay notificaciones</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${getNotificationTypeStyle(notification.notification_type)} ${!notification.is_read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon-wrapper">
                  <i className={`bi ${getNotificationIcon(notification.notification_type)}`}></i>
                </div>
                <div className="notification-content">
                  <div className="item-header">
                    <strong>{notification.title}</strong>
                    <span className="item-date">
                      {formatTimeAgo(notification.time_ago)}
                    </span>
                  </div>
                  <p className="item-message">{notification.message}</p>
                  {notification.metadata && (
                    <div className="notification-metadata">
                      {notification.metadata.postulation_id && (
                        <span className="badge bg-primary me-1">
                          Postulación #{notification.metadata.postulation_id}
                        </span>
                      )}
                      {notification.metadata.petition_id && (
                        <span className="badge bg-secondary me-1">
                          Petición #{notification.metadata.petition_id}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {!notification.is_read && (
                  <div className="unread-indicator"></div>
                )}
              </div>
            ))}
            
            {hasMore && (
              <div className="load-more-container">
                <button 
                  onClick={handleLoadMore} 
                  className="load-more-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="bi bi-hourglass-split me-1"></i>
                      Cargando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-down-circle me-1"></i>
                      Cargar más
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
