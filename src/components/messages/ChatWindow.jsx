// src/components/messages/ChatWindow.jsx
// =====================================================
// Componente: ChatWindow
// -----------------------------------------------------
// Este componente representa la ventana principal de chat de una conversación
// entre dos usuarios (proveedor y cliente). Permite visualizar el historial
// de mensajes y enviar nuevos en tiempo real.
//
// Características principales:
//  - Muestra mensajes previos cargados desde el contexto de mensajes.
//  - Permite enviar mensajes de texto.
//  - Realiza scroll automático al mensaje más reciente.
//  - Identifica y muestra el nombre del otro participante de la conversación.
//  - Maneja estados de carga, envío y error.
//
// Dependencias:
//  - React (useState, useEffect, useRef)
//  - MessageContext (hook personalizado: useMessageContext)
//  - Bootstrap Icons (para iconos de interfaz)
//  - Hoja de estilos: Messages.css
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import { useMessageContext } from '../../contexts/MessageContext';
import './Messages.css';

// =====================================================
// Componente principal: ChatWindow
// -----------------------------------------------------
// @param {Object} props
// @param {Object} props.conversation - Objeto con los datos de la conversación actual (participantes, ID, etc.).
// @param {Function} props.onBack - Función para volver al listado de conversaciones.
// @param {Function} props.onClose - Función para cerrar completamente el chat.
//
// Flujo general:
//  1. Obtiene mensajes desde el contexto global (useMessageContext).
//  2. Escucha cambios en el array de mensajes para auto-hacer scroll.
//  3. Permite escribir un nuevo mensaje y enviarlo al backend.
//  4. Renderiza los mensajes diferenciando los del usuario actual y los del otro participante.
// =====================================================
const ChatWindow = ({ conversation, onBack, onClose }) => {
   // --- Estado del chat ---
  const { messages, loading, sendMessage } = useMessageContext(); // Contexto de mensajes global
  const [newMessage, setNewMessage] = useState(''); // Mensaje en el input
  const [sending, setSending] = useState(false);  // Estado de envío
  const messagesEndRef = useRef(null);    // Referencia para scroll automático
  const messagesContainerRef = useRef(null);  // Contenedor principal de mensajes


  // =====================================================
  // Función: scrollToBottom
  // -----------------------------------------------------
  // Desplaza la vista hacia el último mensaje cada vez que cambia
  // el array de mensajes (simulando comportamiento de apps de mensajería).
  // =====================================================
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

    // =====================================================
  // Función: handleSendMessage
  // -----------------------------------------------------
  // Envía el mensaje actual al backend usando el método `sendMessage`
  // del contexto. Maneja el estado de carga y limpieza del input.
  // =====================================================
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

    // =====================================================
  // Función: formatMessageTime
  // -----------------------------------------------------
  // Convierte la fecha ISO de creación del mensaje en un formato legible
  // de hora local (por ejemplo, "14:32").
  // =====================================================
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

    // =====================================================
  // Función: getParticipantName
  // -----------------------------------------------------
  // Obtiene el nombre del otro participante en la conversación
  // (distinto al usuario actual). Usa los datos almacenados en localStorage
  // para identificar al usuario actual.
  // =====================================================
  const getParticipantName = () => {
    if (conversation.participants && conversation.participants.length > 0) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentId = currentUser?.id_user || currentUser?.id;
      const otherParticipant = conversation.participants.find(p => (p.id_user || p.id) !== currentId);
      if (otherParticipant) {
        const full = `${otherParticipant.name || ''} ${otherParticipant.lastname || ''}`.trim();
        return full || otherParticipant.email || 'Usuario';
      }
    }
    return 'Usuario';
  };

    // =====================================================
  // Función: getParticipantAvatar
  // -----------------------------------------------------
  // (Futura mejora)
  // Devuelve la URL del avatar del otro participante, si existiera.
  // Por ahora retorna null y usa un ícono genérico de Bootstrap.
  // =====================================================
  const getParticipantAvatar = () => null;

    // =====================================================
  // Renderizado principal
  // -----------------------------------------------------
  // Estructura general:
  //  1. Encabezado del chat (nombre, botones de navegación)
  //  2. Lista de mensajes (scrollable)
  //  3. Input de nuevo mensaje con botón de envío
  // =====================================================
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
