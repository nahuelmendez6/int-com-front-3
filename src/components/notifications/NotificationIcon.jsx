/**
 * Componente: NotificationIcon
 * 
 * Descripción:
 * ---------------
 * Este componente muestra el **icono de notificaciones** (campana) en la interfaz,
 * generalmente ubicado en la barra superior o en un menú principal.
 * 
 * Su función principal es **indicar la cantidad de notificaciones no leídas** 
 * y permitir abrir el panel de notificaciones al hacer clic.
 * 
 * Funcionalidades principales:
 * -----------------------------
 * - Muestra un ícono de campana (usando Bootstrap Icons).
 * - Muestra una insignia (badge) con el número de notificaciones no leídas.
 * - Limita el contador visual a “99+” si hay más de 99 notificaciones.
 * - Ejecuta una función callback al hacer clic (por ejemplo, abrir un panel lateral).
 * 
 * Props:
 * -------
 * - `onClick` (function): Función que se ejecuta al hacer clic sobre el ícono.
 * - `className` (string): Clase CSS adicional opcional para personalizar estilos.
 * 
 * Contextos utilizados:
 * ----------------------
 * - `useNotificationContext()`:
 *    - `unreadCount`: número total de notificaciones sin leer.
 * 
 * Archivos relacionados:
 * -----------------------
 * - `NotificationContext.jsx`: Proporciona el contexto global de notificaciones.
 * - `Notifications.css`: Define los estilos visuales del ícono y la insignia.
 */

import React from 'react';
import { useNotificationContext } from '../../contexts/NotificationContext.jsx';
import './Notifications.css';

const NotificationIcon = ({ onClick, className = '' }) => {

  // --- Acceso al contexto de notificaciones ---
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
