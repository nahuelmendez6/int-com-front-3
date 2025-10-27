import React from 'react';
import { useMessageContext } from '../../contexts/MessageContext';
import './Messages.css';

const MessageIcon = ({ onClick, className = '' }) => {
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
