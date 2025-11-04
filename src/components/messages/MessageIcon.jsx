/**
 * Componente: MessageIcon
 * 
 * Descripción:
 * ---------------
 * Este componente representa el ícono de mensajes que se muestra, por ejemplo, 
 * en la barra de navegación o el encabezado de la aplicación.
 * 
 * Muestra un ícono de chat junto con un indicador visual (badge) del número de 
 * mensajes no leídos. Si hay más de 99 mensajes sin leer, se muestra “99+”.
 * 
 * Props:
 * -------
 * - `onClick`: Función que se ejecuta cuando el usuario hace clic en el ícono.
 * - `className`: (opcional) Clase CSS adicional para personalizar el estilo.
 * 
 * Contextos utilizados:
 * ----------------------
 * - `useMessageContext()`: Hook de contexto que proporciona el número de mensajes no leídos (`unreadCount`).
 * 
 * Estilos:
 * ---------
 * - Importa `Messages.css` para definir el diseño visual del ícono y el badge.
 */

import React from 'react';
import { useMessageContext } from '../../contexts/MessageContext';
import './Messages.css';

const MessageIcon = ({ onClick, className = '' }) => {
  // Obtener el número de mensajes no leídos desde el contexto global de mensajes
  const { unreadCount } = useMessageContext();

  return (
    <button 
      onClick={onClick} 
      className={`message-icon ${className}`}
      title={`${unreadCount} mensajes no leídos`}
    >
      <i className="bi bi-chat-dots"></i>
      {unreadCount > 0 && (
        <span className="message-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default MessageIcon;
