import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../hooks/useAuth';

const MainLayout = ({ children }) => {
  const { user } = useAuth();

  // Si el usuario no está logueado, no mostramos el layout completo (ej. en la página de login)
  if (!user) {
    return <>{children}</>; // Renderiza solo las rutas sin layout
  }

  return (
    <div className="main-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          {children}
        </div>
      </main>
      
      <style>{`
        .main-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        
        .main-content {
          flex: 1;
          margin-left: 280px; /* Espacio para el sidebar fijo */
          padding: 20px;
          min-height: 100vh;
        }
        
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }
        
        /* Responsive para móviles */
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;