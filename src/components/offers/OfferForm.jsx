/**
 * Componente: OfferForm
 * 
 * Descripción:
 * ---------------
 * Este componente representa un **formulario modal** para crear o editar ofertas de un proveedor.
 * Permite ingresar información de la oferta, como:
 * - Nombre
 * - Tipo de oferta
 * - Descripción
 * - Fecha de inicio y cierre
 * - Estado (activo/inactivo)
 * 
 * Se usa dentro de un modal de React-Bootstrap y soporta tanto creación como edición de ofertas.
 * 
 * Props:
 * -------
 * - `show` (boolean): Indica si el modal está visible.
 * - `onHide` (function): Función que se ejecuta al cerrar el modal.
 * - `onSubmit` (function): Función que se ejecuta al enviar el formulario. Recibe un objeto `offer`.
 * - `initialData` (object | null): Datos iniciales de la oferta para edición. Puede incluir:
 *      - `offer_id`
 *      - `name`
 *      - `description`
 *      - `date_open`
 *      - `date_close`
 *      - `id_type_offer`
 *      - `status`
 * - `offerTypes` (array): Lista de tipos de oferta disponibles para el select. Cada tipo debe tener:
 *      - `id_type_offer`
 *      - `name`
 * 
 * Funcionalidades clave:
 * -----------------------
 * - Inicializa los campos con `initialData` si se proporciona (modo edición).
 * - Resetea el formulario al abrir el modal en modo creación.
 * - Maneja cambios en inputs de texto, textarea y selects.
 * - Convierte fechas a formato `datetime-local` para compatibilidad con HTML5.
 * - Ejecuta `onSubmit` con todos los datos al enviar el formulario.
 * 
 * Estilos y librerías:
 * ----------------------
 * - React-Bootstrap: `Modal`, `Button`
 * - Clases Bootstrap para inputs, labels, filas y columnas.
 */


import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const OfferForm = ({ show, onHide, onSubmit, initialData, offerTypes = [] }) => {
  const [offer, setOffer] = useState({});

  // --- Efecto: inicializar o resetear formulario al abrir el modal ---
  useEffect(() => {
    if (show) {
      setOffer({
        name: initialData?.name || '',
        description: initialData?.description || '',
        date_open: initialData?.date_open ? new Date(initialData.date_open).toISOString().slice(0, 10) : '',
        date_close: initialData?.date_close ? new Date(initialData.date_close).toISOString().slice(0, 10) : '',
        id_type_offer: initialData?.id_type_offer || 1,
        status: initialData?.status || 'active',
      });
    }
  }, [initialData, show]);

  // --- Manejar cambios en cualquier campo del formulario ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer({ ...offer, [name]: value });
  };

  // --- Enviar formulario ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const offerData = {
      ...offer,
      date_open: offer.date_open ? `${offer.date_open}T00:00:00` : null,
      date_close: offer.date_close ? `${offer.date_close}T23:59:59` : null,
    };
    onSubmit(offerData);
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
              <input type="date" className="form-control" id="date_open" name="date_open" value={offer.date_open} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="date_close" className="form-label">Fecha de Cierre</label>
              <input type="date" className="form-control" id="date_close" name="date_close" value={offer.date_close} onChange={handleChange} required />
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
