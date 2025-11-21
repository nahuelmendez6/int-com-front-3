/**
 * Componente: MessagePanel
 * 
 * Descripción:
 * ---------------
 * Este componente muestra el **panel principal de mensajería**, que lista las 
 * conversaciones del usuario y permite abrir el chat correspondiente 
 * (mostrado con el componente `ChatWindow`).
 * 
 * Funcionalidades principales:
 * -----------------------------
 * - Carga y muestra las conversaciones del usuario.
 * - Permite buscar conversaciones mediante una barra de búsqueda.
 * - Indica cuántos mensajes no leídos tiene cada conversación.
 * - Permite abrir una conversación para ver y enviar mensajes.
 * - Puede inicializarse directamente con una conversación específica.
 * 
 * Props:
 * -------
 * - `isOpen` (boolean): Controla si el panel está visible o no.
 * - `onClose` (function): Función ejecutada al cerrar el panel.
 * - `initialConversationId` (number | null): ID de una conversación que debe abrirse automáticamente.
 * 
 * Contextos utilizados:
 * ----------------------
 * - `useMessageContext()`: Proporciona funciones y datos globales de mensajería:
 *    - `conversations`: Lista de conversaciones del usuario.
 *    - `unreadCount`: Número total de mensajes no leídos.
 *    - `loading`: Estado de carga general.
 *    - `openConversation(conversation)`: Abre una conversación seleccionada.
 *    - `loadConversations()`: Carga todas las conversaciones desde la API.
 *    - `searchConversations(query)`: Busca conversaciones según el término ingresado.
 * 
 * Hooks principales:
 * -------------------
 * - `useState`: Controla los estados de búsqueda, conversación seleccionada, etc.
 * - `useEffect`: Carga las conversaciones al abrir el panel y abre la inicial si se indica.
 * 
 * Archivos relacionados:
 * -----------------------
 * - `ChatWindow.jsx`: Muestra la conversación seleccionada.
 * - `Messages.css`: Contiene los estilos visuales del panel y la lista de mensajes.
 */

import React, { useState, useEffect } from 'react';
import { useMessageContext } from '../../contexts/MessageContext';
import ChatWindow from './ChatWindow';
import './Messages.css';

const MessagePanel = ({ isOpen, onClose, initialConversationId = null }) => {

   // --- Contexto global de mensajería ---
  const { 
    conversations, 
    unreadCount, 
    loading, 
    openConversation,
    loadConversations,
    searchConversations
  } = useMessageContext();


  // --- Estados locales ---
  const [searchQuery, setSearchQuery] = useState('');   // Texto de búsqueda
  const [searchResults, setSearchResults] = useState([]); // Resultados filtrados
  const [showSearch, setShowSearch] = useState(false);     // Controla visibilidad del buscador
  const [selectedConversation, setSelectedConversation] = useState(null); // Conversación activa

  // --- Efecto: cargar conversaciones al abrir el panel ---
  useEffect(() => {
    if (isOpen && conversations.length === 0) {
      loadConversations();
    }
  }, [isOpen, conversations.length, loadConversations]);

  // --- Efecto: abrir conversación inicial si se pasa un ID ---
  useEffect(() => {
    if (isOpen && initialConversationId) {
      // Abrir inmediatamente con un objeto mínimo.
      // `openConversation` se encargará de cargar los datos completos.
      const minimal = { id: initialConversationId, participants: [] };
      setSelectedConversation(minimal);
      openConversation(minimal);
      // Asegurar que la lista de conversaciones esté actualizada.
      loadConversations();
    }
  }, [isOpen, initialConversationId]); // Dependencias simplificadas

  const handleSearch = async (query) => {
    if (query.trim()) {
      try {
        const results = await searchConversations(query);
        setSearchResults(results);
        setShowSearch(true);
      } catch (error) {
        console.error('Error searching conversations:', error);
      }
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  // --- Abrir una conversación desde la lista ---
  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    openConversation(conversation);
  };

  // --- Volver a la lista desde una conversación abierta ---
  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // --- Formatear fecha de último mensaje (estilo "hace X minutos") ---
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

   // --- Obtener nombre visible de la otra persona en la conversación ---
  const getConversationDisplayName = (conversation) => {
    // participants: [{ id_user, email, name, lastname }]
    if (conversation.participants && conversation.participants.length > 0) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentId = currentUser?.id_user || currentUser?.id;
      const otherParticipant = conversation.participants.find(p => (p.id_user || p.id) !== currentId);
      if (otherParticipant) {
        const full = `${otherParticipant.name || ''} ${otherParticipant.lastname || ''}`.trim();
        return full || otherParticipant.email || 'Usuario';
      }
    }
    return 'Conversación';
  };

  const getConversationAvatar = () => null;

  if (!isOpen) return null;

  if (selectedConversation) {
    return (
      <ChatWindow 
        conversation={selectedConversation}
        onBack={handleBackToList}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="message-panel">
      <div className="panel-header">
        <h3>
          Mensajes 
          {unreadCount > 0 && (
            <span className="unread-count">({unreadCount} no leídos)</span>
          )}
        </h3>
        <div className="panel-actions">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="search-btn"
            title="Buscar conversaciones"
          >
            <i className="bi bi-search"></i>
          </button>
          <button onClick={onClose} className="close-btn">
            <i className="bi bi-x"></i>
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="search-input"
          />
        </div>
      )}

      <div className="panel-body">
        {loading && conversations.length === 0 ? (
          <div className="loading-messages">
            <i className="bi bi-hourglass-split"></i>
            <p>Cargando conversaciones...</p>
          </div>
        ) : (showSearch ? searchResults : conversations).length === 0 ? (
          <div className="no-messages">
            <i className="bi bi-chat-dots"></i>
            <p>
              {showSearch ? 'No se encontraron conversaciones' : 'No hay conversaciones'}
            </p>
          </div>
        ) : (
          <div className="conversations-list">
            {(showSearch ? searchResults : conversations).map((conversation, index) => (
              <div 
                key={conversation.id || `conv-${index}-${conversation?.last_message?.id || 'noid'}`}
                className={`conversation-item ${conversation.unread_count > 0 ? 'unread' : ''}`}
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="conversation-avatar">
                  {getConversationAvatar(conversation) ? (
                    <img 
                      src={getConversationAvatar(conversation)} 
                      alt="Avatar" 
                      className="avatar-img"
                    />
                  ) : (
                    <i className="bi bi-person-circle"></i>
                  )}
                  {conversation.unread_count > 0 && (
                    <span className="unread-indicator"></span>
                  )}
                </div>
                
                <div className="conversation-content">
                  <div className="conversation-header">
                    <h4 className="conversation-name">
                      {getConversationDisplayName(conversation)}
                    </h4>
                    <span className="conversation-time">
                      {formatTimeAgo(conversation.last_message?.created_at || conversation.updated_at)}
                    </span>
                  </div>
                  
                  <p className="conversation-preview">
                    {conversation.last_message?.content || 'Sin mensajes'}
                  </p>
                  
                  {conversation.unread_count > 0 && (
                    <div className="unread-badge">
                      {conversation.unread_count}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePanel;
