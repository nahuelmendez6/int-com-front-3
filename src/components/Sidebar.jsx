import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const closeOffcanvas = () => {
    setShowOffcanvas(false);
  };

  return (
    <>
      {/* Botón para mostrar sidebar en móviles */}
      <button
        className="btn btn-primary d-md-none position-fixed"
        style={{ top: '80px', left: '10px', zIndex: 1050 }}
        type="button"
        onClick={toggleOffcanvas}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Sidebar para pantallas grandes */}
      <div className="d-none d-md-block">
        <div
          className="bg-white shadow rounded-3 position-fixed"
          style={{
            top: '80px',
            left: '20px',
            width: '250px',
            height: 'calc(100vh - 100px)',
            zIndex: 1000
          }}
        >
          <div className="p-3">
            <h5 className="mb-3">Navegación</h5>
            <nav className="nav flex-column">
              <NavLink
                to="/feed"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center mb-2 ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <i className="bi bi-house-door me-2"></i>
                Inicio
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center mb-2 ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <i className="bi bi-person me-2"></i>
                Perfil
              </NavLink>
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center mb-2 ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <i className="bi bi-chat-dots me-2"></i>
                Mensajes
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center mb-2 ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <i className="bi bi-gear me-2"></i>
                Configuración
              </NavLink>
            </nav>
          </div>
        </div>
      </div>

      {/* Offcanvas para móviles */}
      <div
        className={`offcanvas offcanvas-start ${showOffcanvas ? 'show' : ''}`}
        tabIndex="-1"
        style={{ visibility: showOffcanvas ? 'visible' : 'hidden' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Navegación</h5>
          <button
            type="button"
            className="btn-close"
            onClick={closeOffcanvas}
          ></button>
        </div>
        <div className="offcanvas-body">
          <nav className="nav flex-column">
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center mb-2 ${
                  isActive ? 'active' : ''
                }`
              }
              onClick={closeOffcanvas}
            >
              <i className="bi bi-house-door me-2"></i>
              Inicio
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center mb-2 ${
                  isActive ? 'active' : ''
                }`
              }
              onClick={closeOffcanvas}
            >
              <i className="bi bi-person me-2"></i>
              Perfil
            </NavLink>
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center mb-2 ${
                  isActive ? 'active' : ''
                }`
              }
              onClick={closeOffcanvas}
            >
              <i className="bi bi-chat-dots me-2"></i>
              Mensajes
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center mb-2 ${
                  isActive ? 'active' : ''
                }`
              }
              onClick={closeOffcanvas}
            >
              <i className="bi bi-gear me-2"></i>
              Configuración
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Overlay para móviles */}
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
