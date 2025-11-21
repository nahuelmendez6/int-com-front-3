import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import OfferForm from '../components/offers/OfferForm';
import OfferList from '../components/offers/OfferList';
import { getOffers, createOffer, updateOffer, deleteOffer, getOfferTypes } from '../services/offers.service.js';
import ConfirmationModal from '../components/common/ConfirmationModal';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [offerTypes, setOfferTypes] = useState([]);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerToDeleteId, setOfferToDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingOffer) {
        const response = await updateOffer(editingOffer.offer_id, offerData);
        setOffers(offers.map(o => 
          o.offer_id === editingOffer.offer_id ? response.data : o
        ));
      } else {
        const response = await createOffer(offerData);
        // Asumimos que la API devuelve la nueva oferta con su ID y datos completos.
        // La añadimos al principio de la lista para que sea visible inmediatamente.
        setOffers([response.data, ...offers]);
      }
      setShowModal(false);
      setEditingOffer(null);
      // Se elimina fetchOffers() para evitar la recarga completa.
      // La UI se actualiza manipulando el estado localmente.
    } catch (err) {
      setError(editingOffer ? 'Error al actualizar la oferta.' : 'Error al crear la oferta.');
    } finally {
      setIsSubmitting(false);
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

  const handleDeleteClick = (offerId) => {
    setOfferToDeleteId(offerId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!offerToDeleteId) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await deleteOffer(offerToDeleteId);
      // Filtramos la oferta eliminada del estado local en lugar de recargar.
      setOffers(offers.filter(o => o.offer_id !== offerToDeleteId));
    } catch (err) {
      setError('Error al eliminar la oferta.');
    } finally {
      setShowDeleteModal(false);
      setOfferToDeleteId(null);
      setIsSubmitting(false);
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
            isSubmitting={isSubmitting}
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
            <div style={{ position: 'relative' }}>
              {isSubmitting && (
                <div className="loading-overlay">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Procesando...</span>
                  </div>
                </div>
              )}
              <OfferList offers={offers} onEdit={handleShowEditModal} onDelete={handleDeleteClick} />
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        body="¿Estás seguro de que quieres eliminar esta oferta? Esta acción no se puede deshacer."
      />

      <style>{`
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }
      `}</style>
    </div>
  );
};

export default OffersPage;