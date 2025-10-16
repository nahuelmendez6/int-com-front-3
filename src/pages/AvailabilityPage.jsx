import React from 'react';
import AvailabilityManager from '../components/availability/AvailabilityManager';

const AvailabilityPage = () => {
  return (
    <div className="availability-page">
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
  );
};

export default AvailabilityPage;