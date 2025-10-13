import React from 'react';
import Sidebar from '../components/Sidebar';
import AvailabilityManager from '../components/availability/AvailabilityManager';

const AvailabilityPage = () => {
  return (
    <div className="min-vh-100 bg-light">
      <Sidebar />
      <div 
        className="container-fluid main-content"
        style={{
          paddingTop: '10px',
          paddingLeft: '280px',
          paddingRight: '10px',
        }}
      >
        <div className="card shadow rounded-3">
          <div className="card-body p-4">
            <h1 className="card-title mb-4">
              <i className="bi bi-calendar-check me-2"></i>
              Gestionar Disponibilidad
            </h1>
            <p className="text-muted mb-4">
              Define tus horarios de trabajo para cada día de la semana. Los clientes podrán ver tu disponibilidad y solicitar tus servicios en los horarios que establezcas.
            </p>
            <AvailabilityManager />
          </div>
        </div>
      </div>
      <style>{`
        .main-content {
            width: 100%;
            max-width: none;
            margin-left: 0;
            margin-right: 0;
        }
        @media (max-width: 767.98px) {
          .main-content {
            padding-left: 10px !important;
            padding-right: 10px !important;
            padding-top: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AvailabilityPage;