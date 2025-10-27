import React, { useState, useEffect, useRef } from 'react';
import { useMessageContext } from '../../contexts/MessageContext';
import './Messages.css';

const ChatWindow = ({ conversation, onBack, onClose }) => {
  const { messages, loading, sendMessage } = useMessageContext();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll automático al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getParticipantName = () => {
    // El backend devuelve participans como un array de usuarios
    if (conversation.participans && conversation.participans.length > 0) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const otherParticipant = conversation.participans.find(p => p.id !== currentUser.id);
      
      if (otherParticipant) {
        return `${otherParticipant.first_name || ''} ${otherParticipant.last_name || ''}`.trim() || otherParticipant.username || 'Usuario';
      }
    }
    return 'Usuario';
  };

  const getParticipantAvatar = () => {
    // El backend devuelve participans como un array de usuarios
    if (conversation.participans && conversation.participans.length > 0) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const otherParticipant = conversation.participans.find(p => p.id !== currentUser.id);
      
      if (otherParticipant?.profile_image) {
        return otherParticipant.profile_image;
      }
    }
    return null;
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button onClick={onBack} className="back-btn">
          <i className="bi bi-arrow-left"></i>
        </button>
        <div className="chat-participant">
          {getParticipantAvatar() ? (
            <img 
              src={getParticipantAvatar()} 
              alt="Avatar" 
              className="participant-avatar"
            />
          ) : (
            <i className="bi bi-person-circle"></i>
          )}
          <div className="participant-info">
            <h4>{getParticipantName()}</h4>
            <span className="online-status">En línea</span>
          </div>
        </div>
        <button onClick={onClose} className="close-btn">
          <i className="bi bi-x"></i>
        </button>
      </div>

      <div className="chat-messages" ref={messagesContainerRef}>
        {loading && messages.length === 0 ? (
          <div className="loading-messages">
            <i className="bi bi-hourglass-split"></i>
            <p>Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <i className="bi bi-chat-dots"></i>
            <p>No hay mensajes en esta conversación</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.is_own ? 'own-message' : 'other-message'}`}
            >
              <div className="message-content">
                <div className="message-text">
                  {message.content}
                </div>
                <div className="message-time">
                  {formatMessageTime(message.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <form onSubmit={handleSendMessage} className="message-form">
          <div className="input-group">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="message-input"
              disabled={sending}
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={!newMessage.trim() || sending}
            >
              {sending ? (
                <i className="bi bi-hourglass-split"></i>
              ) : (
                <i className="bi bi-send"></i>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
