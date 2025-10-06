import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-white shadow rounded-3 position-fixed w-100"
      style={{
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 20px)',
        zIndex: 1030
      }}
    >
      <div className="container-fluid">
        {/* Logo o título */}
        <Link to="/feed" className="navbar-brand fw-bold">
          Mi App
        </Link>

        {/* Botón para colapsar en móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido del navbar */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Dropdown de usuario */}
            <li className="nav-item dropdown">
              <button
                className="btn btn-link nav-link dropdown-toggle d-flex align-items-center"
                type="button"
                onClick={toggleDropdown}
                aria-expanded={showDropdown}
              >
                <i className="bi bi-person-circle fs-4 me-1"></i>
                <span className="d-none d-sm-inline">Usuario</span>
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
                  <Link
                    to="/logout"
                    className="dropdown-item d-flex align-items-center"
                    onClick={closeDropdown}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </Link>
                </div>
              )}
            </li>
          </ul>
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
    </nav>
  );
};

export default Navbar;
