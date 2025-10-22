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
          <div className="content-wrapper">
            {children}
          </div>
        </div>
      </main>
      
      <style>{`
        .main-layout {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .main-content {
          flex: 1;
          margin-left: 280px; /* Espacio para el sidebar fijo */
          padding: 20px;
          min-height: 100vh;
          transition: margin-left 0.3s ease;
        }
        
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-height: calc(100vh - 40px);
          padding: 0;
          overflow: hidden;
        }
        
        /* Responsive para móviles */
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 10px;
          }
          
          .content-wrapper {
            border-radius: 15px;
            min-height: calc(100vh - 20px);
          }
        }

        @media (max-width: 576px) {
          .main-content {
            padding: 5px;
          }
          
          .content-wrapper {
            border-radius: 10px;
            min-height: calc(100vh - 10px);
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;