import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import OfferForm from '../components/offers/OfferForm';
import OfferList from '../components/offers/OfferList';
import { getOffers, createOffer, updateOffer, deleteOffer } from '../services/offers.service.js';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOffers();
      setOffers(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las ofertas.');
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
    if (window.confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      try {
        await deleteOffer(offerId);
        fetchOffers(); // Recargar lista
      } catch (err) {
        setError('Error al eliminar la oferta.');
      }
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <Sidebar />
      <div 
        className="container-fluid"
        style={{
          paddingTop: '80px',
          paddingLeft: '290px',
          paddingRight: '20px',
          width: '100%',
          maxWidth: 'none'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Mis Ofertas</h1>
          <Button variant="primary" onClick={handleShowCreateModal}>
            <i className="bi bi-plus-lg me-2"></i>
            Crear Nueva Oferta
          </Button>
        </div>
        
        <OfferForm 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          onSubmit={handleSubmit} 
          initialData={editingOffer}
        />

        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Ofertas Activas</h5>
            {loading && <p>Cargando ofertas...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && <OfferList offers={offers} onEdit={handleShowEditModal} onDelete={handleDelete} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;