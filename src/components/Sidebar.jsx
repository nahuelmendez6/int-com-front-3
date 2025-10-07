import { NavLink } from 'react-router-dom';
import { useState } from 'react';

import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const { profile } = useAuth();


  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const closeOffcanvas = () => {
    setShowOffcanvas(false);
  };


  // accesos por rol
  const linksByRole = {
    customer: [
      { to: '/feed', label: 'Inicio', icon: 'bi-house-door'},
      { to: '/profile', label: 'Perfil', icon: 'bi-person'},
      { to: '/messages', label: 'Mensajes', icon: 'bi-chat-dots'},
    ],
    provider: [
      { to: '/feed', label: 'Inicio', icon: 'bi-house-door'},
      { to: '/profile', label: 'Perfil', icon: 'bi-person'},
      { to: '/availability', label: 'Disponibilidad', icon: 'bi-calendar-check'},
      { to: '/offers', label: 'Ofertas', icon: 'bi-tag'},
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
        onClick={onClick}
      >
        <i className={`bi ${link.icon} me-2`}></i>
        {link.label}
      </NavLink>
    ));


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
          className="bg-white shadow rounded-3 position-fixed"
          style={{
            top: '10px',
            left: '20px',
            width: '250px',
            height: 'calc(100vh - 20px)',
            zIndex: 1000,
          }}
        >
          <div className="p-3">
            <nav className="nav flex-column">
              {renderLinks()}
            </nav>
          </div>
        </div>
      </div>

      {/* Offcanvas móvil */}
      <div
        className={`offcanvas offcanvas-start ${showOffcanvas ? 'show' : ''}`}
        tabIndex="-1"
        style={{ visibility: showOffcanvas ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Navegación</h5>
          <button type="button" className="btn-close" onClick={closeOffcanvas}></button>
        </div>
        <div className="offcanvas-body">
          <nav className="nav flex-column">{renderLinks(closeOffcanvas)}</nav>
        </div>
      </div>

      {/* Overlay móvil */}
      {showOffcanvas && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={closeOffcanvas}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
