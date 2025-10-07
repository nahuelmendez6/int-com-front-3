import React from 'react';

const OfferList = ({ offers, onEdit, onDelete }) => {
  if (offers.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No tienes ofertas activas en este momento.
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
          <div className="mt-2">
            <button onClick={() => onEdit(offer)} className="btn btn-sm btn-outline-primary me-2">Editar</button>
            <button onClick={() => onDelete(offer.offer_id)} className="btn btn-sm btn-outline-danger">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OfferList;
