import React from 'react';

const OfferList = ({ offers }) => {
  if (offers.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-3">
          <i className="bi bi-gift" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
        </div>
        <h5 className="text-muted">No hay ofertas disponibles</h5>
        <p className="text-muted">Vuelve más tarde para ver nuevas ofertas</p>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {offers.map((offer, index) => (
        <div key={offer.offer_id} className="col-12">
          <div className="social-card offer-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="offer-icon me-3">
                    <i className="bi bi-tag-fill text-primary" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold text-dark">{offer.name}</h5>
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge badge-social ${offer.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        <i className={`bi ${offer.status === 'active' ? 'bi-check-circle' : 'bi-pause-circle'} me-1`}></i>
                        {offer.status === 'active' ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-muted mb-3">{offer.description}</p>
              
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted small">
                  <i className="bi bi-calendar-event me-1"></i>
                  <span>Desde: {new Date(offer.date_open).toLocaleDateString()}</span>
                </div>
                <div className="text-muted small">
                  <i className="bi bi-calendar-x me-1"></i>
                  <span>Hasta: {new Date(offer.date_close).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OfferList;

