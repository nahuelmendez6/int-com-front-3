import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useAuth } from '../hooks/useAuth';
import NotificationIcon from './notifications/NotificationIcon';
import NotificationPanel from './notifications/NotificationPanel';
import MessageIcon from './messages/MessageIcon';
import MessagePanel from './messages/MessagePanel';

const Sidebar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [initialConversationId, setInitialConversationId] = useState(null);
  const { profile, logout } = useAuth();
  const navigate = useNavigate();


  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const closeOffcanvas = () => {
    setShowOffcanvas(false);
  };

  const handleLogout = () => {
    logout();
    closeOffcanvas();
    navigate('/login');
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  }

  const closeNotifications = () => {
    setShowNotifications(false);
  }

  const toggleMessages = () => {
    setShowMessages(!showMessages);
  }

  const closeMessages = () => {
    setShowMessages(false);
    setInitialConversationId(null);
  }

  // Abrir panel de mensajes por evento global
  useEffect(() => {
    const handler = (e) => {
      setInitialConversationId(e.detail?.conversationId || null);
      setShowMessages(true);
    };
    window.addEventListener('openMessages', handler);
    return () => window.removeEventListener('openMessages', handler);
  }, []);


  // accesos por rol
  const linksByRole = {
    customer: [
      { to: '/feed', label: 'Inicio', icon: 'bi-house-door'},
      { to: '/profile', label: 'Perfil', icon: 'bi-person'},
      { to: '/petitions', label: 'Peticiones', icon: 'bi-card-list'},
      { to: '/interests', label: 'Intereses', icon: 'bi-heart'},
      { to: '/messages', label: 'Mensajes', icon: 'bi-chat-dots'},
      { to: '/contrataciones', label: 'Mis Contrataciones', icon: 'bi-check2-square'},
    ],
    provider: [
      { to: '/feed', label: 'Inicio', icon: 'bi-house-door'},
      { to: '/profile', label: 'Perfil', icon: 'bi-person'},
      { to: '/availability', label: 'Disponibilidad', icon: 'bi-calendar-check'},
      { to: '/offers', label: 'Ofertas', icon: 'bi-tag'},
      { to: '/service-area', label: 'Área de servicio', icon: 'bi-geo-alt'},
      { to: '/portfolio', label: 'Mi Portfolio', icon: 'bi-briefcase'},
      { to: '/mis-postulaciones', label: 'Mis Postulaciones', icon: 'bi-journal-text' },
      { to: '/contrataciones', label: 'Trabajos Aprobados', icon: 'bi-check2-square' },
    ]
  }

  // si no hay perfil, mostramos esto
  const links = profile ? linksByRole[profile.role] || [] : [];

  const renderLinks = (onClick) =>
    links.map((link) => (
      
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `nav-link d-flex align-items-center mb-2 ${isActive ? 'active' : ''}`
        }
        style={({ isActive }) => ({
          backgroundColor: isActive || hoveredLink === link.to ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          borderRight: isActive ? '4px solid white' : 'none',
          color: 'white',
          transition: 'background-color 0.2s ease-in-out',
          borderRadius: '5px'
        })}
        onClick={onClick}
        onMouseEnter={() => setHoveredLink(link.to)}
        onMouseLeave={() => setHoveredLink(null)}
      >
        <i className={`bi ${link.icon} me-2`}></i>
        {link.label}
      </NavLink>
    ));

  const renderSidebarFooter = () => (
    <div className="mt-auto">
        <div className="p-3 border-top" style={{borderColor: 'rgba(255,255,255,0.5)'}}>
            <div className="d-flex align-items-center justify-content-between text-white mb-3">
                <div className="d-flex align-items-center">
                    {profile && profile.user && profile.user.profile_image ? (
                        <img src={profile.user.profile_image} alt="Perfil" className="rounded-circle" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                    ) : (
                        <i className="bi bi-person-circle fs-2"></i>
                    )}
                    <span className="ms-2">
                        {profile && profile.user ? profile.user.name : "Usuario"}
                    </span>
                </div>
                <NotificationIcon 
                    onClick={toggleNotifications}
                    className="ms-2"
                />
                <MessageIcon 
                    onClick={toggleMessages}
                    className="ms-2"
                />
            </div>
            <button
                className="btn btn-outline-light w-100"
                onClick={handleLogout}
            >
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar sesión
            </button>
        </div>
    </div>
  );


  return (
    <>
      {/* Botón móvil */}
      <button
        className="btn btn-primary d-md-none position-fixed"
        style={{ top: '20px', left: '10px', zIndex: 1050 }}
        type="button"
        onClick={toggleOffcanvas}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Sidebar desktop */}
      <div className="d-none d-md-block">
        <div
          className="shadow rounded-3 position-fixed"
          style={{
            backgroundColor: '#46807E',
            top: '10px',
            left: '20px',
            width: '250px',
            height: 'calc(100vh - 20px)',
            zIndex: 1000,
            borderRight: '4px solid #3a706e'
          }}
        >
          <div className="p-3 d-flex flex-column" style={{ height: '100%'}}>
            <div>
              <h4 className="text-white text-center mb-4">Integración Comunitaria</h4>
              <nav className="nav flex-column">
                {renderLinks()}
              </nav>
            </div>
            {renderSidebarFooter()}
          </div>
        </div>
      </div>

      {/* Offcanvas móvil */}
      <div
        className={`offcanvas offcanvas-start ${showOffcanvas ? 'show' : ''}`}
        tabIndex="-1"
        style={{ visibility: showOffcanvas ? 'visible' : 'hidden', backgroundColor: '#46807E' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" style={{ color: 'white' }}>Integración Comunitaria</h5>
          <button type="button" className="btn-close btn-close-white" onClick={closeOffcanvas}></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <nav className="nav flex-column">{renderLinks(closeOffcanvas)}</nav>
          {renderSidebarFooter()}
        </div>
      </div>

      {/* Overlay móvil */}
      {showOffcanvas && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={closeOffcanvas}
        ></div>
      )}

      {/* Panel de notificaciones */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={closeNotifications}
      />

      {/* Panel de mensajes */}
      <MessagePanel
        isOpen={showMessages}
        onClose={closeMessages}
        initialConversationId={initialConversationId}
      />
    </>
  );
};

export default Sidebar;