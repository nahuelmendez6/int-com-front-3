import React from 'react';

const OfferList = ({ offers }) => {
  if (offers.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No hay ofertas disponibles en este momento.
      </div>
    );
  }

  return (
    <div className="list-group">
      {offers.map(offer => (
        <div key={offer.offer_id} className="list-group-item list-group-item-action flex-column align-items-start">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1">{offer.name}</h5>
            <small>Estado: <span className={`badge bg-${offer.status === 'active' ? 'success' : 'secondary'}`}>{offer.status}</span></small>
          </div>
          <p className="mb-1">{offer.description}</p>
          <small className="text-muted">Válida desde {new Date(offer.date_open).toLocaleString()} hasta {new Date(offer.date_close).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default OfferList;

