import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const OfferForm = ({ show, onHide, onSubmit, initialData, offerTypes = [] }) => {
  const [offer, setOffer] = useState({});

  useEffect(() => {
    // When the modal is shown, populate the form with initial data or reset it
    if (show) {
      setOffer({
        name: initialData?.name || '',
        description: initialData?.description || '',
        date_open: initialData?.date_open ? new Date(initialData.date_open).toISOString().slice(0, 16) : '',
        date_close: initialData?.date_close ? new Date(initialData.date_close).toISOString().slice(0, 16) : '',
        id_type_offer: initialData?.id_type_offer || 1,
        status: initialData?.status || 'active',
      });
    }
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer({ ...offer, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(offer);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData?.offer_id ? 'Editar Oferta' : 'Crear Nueva Oferta'}</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre de la Oferta</label>
            <input type="text" className="form-control" id="name" name="name" value={offer.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="id_type_offer" className="form-label">Tipo de Oferta</label>
            <select className="form-select" id="id_type_offer" name="id_type_offer" value={offer.id_type_offer} onChange={handleChange} required>
              <option value="" disabled>Seleccione un tipo</option>
              {offerTypes.map(type => (
                <option key={type.id_type_offer} value={type.id_type_offer}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea className="form-control" id="description" name="description" value={offer.description} onChange={handleChange} required></textarea>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="date_open" className="form-label">Fecha de Inicio</label>
              <input type="datetime-local" className="form-control" id="date_open" name="date_open" value={offer.date_open} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="date_close" className="form-label">Fecha de Cierre</label>
              <input type="datetime-local" className="form-control" id="date_close" name="date_close" value={offer.date_close} onChange={handleChange} required />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button variant="primary" type="submit">{initialData?.offer_id ? 'Guardar Cambios' : 'Publicar Oferta'}</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default OfferForm;