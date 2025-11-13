import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import OfferForm from '../components/offers/OfferForm';
import OfferList from '../components/offers/OfferList';
import { getOffers, createOffer, updateOffer, deleteOffer, getOfferTypes } from '../services/offers.service.js';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [offerTypes, setOfferTypes] = useState([]);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      const [offersRes, offerTypesRes] = await Promise.all([
        getOffers(),
        getOfferTypes(),
      ]);
      setOffers(offersRes.data);
      setOfferTypes(offerTypesRes.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleSubmit = async (offerData) => {
    try {
      if (editingOffer) {
        await updateOffer(editingOffer.offer_id, offerData);
      } else {
        await createOffer(offerData);
      }
      setShowModal(false);
      setEditingOffer(null);
      fetchOffers(); // Recargar lista
    } catch (err) {
      setError('Error al guardar la oferta.');
    }
  };

  const handleShowCreateModal = () => {
    setEditingOffer(null);
    setShowModal(true);
  };

  const handleShowEditModal = (offer) => {
    setEditingOffer(offer);
    setShowModal(true);
  };

  const handleDelete = async (offerId) => {
    try {
      await deleteOffer(offerId);
      fetchOffers(); // Recargar lista
    } catch (err) {
      setError('Error al eliminar la oferta.');
    }
  };

  return (
    <div className="offers-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="card-title mb-0">
              <i className="bi bi-tag me-2"></i>
              Mis Ofertas
            </h1>
            <Button variant="primary" className="btn-social btn-primary-social" onClick={handleShowCreateModal}>
              <i className="bi bi-plus-lg me-2"></i>
              Crear Nueva Oferta
            </Button>
          </div>
          <p className="text-muted mb-4">
            Gestiona tus ofertas de servicios. Crea nuevas ofertas, edita las existentes o elimina las que ya no estén activas.
          </p>
          
          <OfferForm 
            show={showModal} 
            onHide={() => setShowModal(false)} 
            onSubmit={handleSubmit} 
            initialData={editingOffer}
            offerTypes={offerTypes}
          />

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando ofertas...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="bi bi-tag" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              </div>
              <h5 className="text-muted mb-3">No tienes ofertas</h5>
              <p className="text-muted mb-0">Crea tu primera oferta para comenzar a ofrecer tus servicios.</p>
            </div>
          ) : (
            <OfferList offers={offers} onEdit={handleShowEditModal} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
};

export default OffersPage;