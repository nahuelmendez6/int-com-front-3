import React, { useState, useEffect } from 'react';
import { useMessageContext } from '../../contexts/MessageContext';
import ChatWindow from './ChatWindow';
import './Messages.css';

const MessagePanel = ({ isOpen, onClose, initialConversationId = null }) => {
  const { 
    conversations, 
    unreadCount, 
    loading, 
    openConversation,
    loadConversations,
    searchConversations
  } = useMessageContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Cargar conversaciones cuando se abre el panel
  useEffect(() => {
    if (isOpen && conversations.length === 0) {
      loadConversations();
    }
  }, [isOpen, conversations.length, loadConversations]);

  // Abrir conversación inicial por id si se solicita
  useEffect(() => {
    if (!isOpen || !initialConversationId) return;
    const conv = conversations.find(c => c.id === initialConversationId);
    if (conv) {
      setSelectedConversation(conv);
      openConversation(conv);
    } else {
      // Abrir inmediatamente con objeto mínimo si aún no está en la lista
      const minimal = { id: initialConversationId, participants: [] };
      setSelectedConversation(minimal);
      openConversation(minimal);
      // Asegurar refresco de la lista
      loadConversations();
    }
  }, [isOpen, initialConversationId, conversations, openConversation, loadConversations]);

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

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    openConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

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
