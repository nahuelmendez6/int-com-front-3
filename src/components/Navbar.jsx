import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  
  const {user, profile, logout } = useAuth();
  console.log('este es el perfil',profile)
  const navigate = useNavigate();
  
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
    closeDropdown();
    navigate('/login');
  }

  return (
    <nav
      className="navbar navbar-expand-lg bg-white shadow rounded-3 position-fixed"
      style={{
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)', // Centrar el navbar
        width: 'auto', // Ancho automático basado en el contenido
        minWidth: '200px', // Ancho mínimo reducido
        maxWidth: '300px', // Ancho máximo más pequeño
        zIndex: 1030
      }}
    >
      <div className="container-fluid">
        {/* Logo o título - solo visible en desktop */}
        <Link to="/feed" className="navbar-brand fw-bold d-none d-md-inline">
          Mi App
        </Link>

        {/* Contenido del navbar */}
        <div className="navbar-nav ms-auto">
          {/* Dropdown de usuario */}
          <div className="nav-item dropdown">
            <button
              className="btn btn-link nav-link dropdown-toggle d-flex align-items-center"
              type="button"
              onClick={toggleDropdown}
              aria-expanded={showDropdown}
            >
              <i className="bi bi-person-circle fs-4"></i>
              <span className="d-none d-md-inline ms-2">
                {profile && profile.user ? profile.user.name : "Usuario"}
              </span>
            </button>
            
            {showDropdown && (
              <div
                className="dropdown-menu show position-absolute"
                style={{
                  right: '0',
                  left: 'auto',
                  top: '100%',
                  marginTop: '0.5rem'
                }}
              >
                <Link
                  to="/profile"
                  className="dropdown-item d-flex align-items-center"
                  onClick={closeDropdown}
                >
                  <i className="bi bi-person me-2"></i>
                  Perfil
                </Link>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay para cerrar dropdown al hacer click fuera */}
      {showDropdown && (
        <div
          className="position-fixed"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1
          }}
          onClick={closeDropdown}
        ></div>
      )}

      {/* Estilos responsivos para el navbar */}
      <style>{`
        @media (min-width: 768px) {
          .navbar {
            left: 290px !important; /* Comenzar desde el margen del sidebar */
            transform: none !important; /* Quitar centrado */
            width: calc(100% - 310px) !important; /* Extender hasta el margen derecho */
            max-width: none !important; /* Sin límite de ancho máximo */
            min-width: auto !important; /* Sin ancho mínimo */
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
