import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import PetitionList from '../components/petitions/PetitionList';
import CreatePetitionForm from '../components/petitions/CreatePetitionForm';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { useAuth } from '../hooks/useAuth.js';
import { usePetitions } from '../hooks/usePetitions.js';
import { deletePetition } from '../services/petitions.service.js';

const PetitionsPage = () => {
  const { profile } = useAuth();
  const { petitions, loading, error, refetch } = usePetitions(profile);

  const [editingPetition, setEditingPetition] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [petitionToDeleteId, setPetitionToDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleCreateClick = () => {
    setEditingPetition(null);
    setShowFormModal(true);
  };

  const handleEditClick = (petition) => {
    setEditingPetition(petition);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id) => {
    setPetitionToDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!petitionToDeleteId) return;

    try {
      await deletePetition(petitionToDeleteId);
      refetch(); // recarga las peticiones del customer
    } catch (err) {
      console.error(err);
      setLocalError('Error al eliminar la petición.');
    } finally {
      setShowDeleteModal(false);
      setPetitionToDeleteId(null);
    }
  };

  const handlePetitionCreatedOrUpdated = () => {
    // Llama a refetch para recargar la lista de peticiones desde el servidor.
    refetch();
    setShowFormModal(false);
    setEditingPetition(null);
  };

  return (
    <div className="petitions-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="card-title mb-0">
              <i className="bi bi-card-list me-2"></i>
              Mis Peticiones
            </h1>
            <Button variant="primary" className="btn-social btn-primary-social" onClick={handleCreateClick}>
              <i className="bi bi-plus-lg me-2"></i> Nueva Petición
            </Button>
          </div>
          <p className="text-muted mb-4">
            Gestiona tus peticiones de servicios. Crea nuevas peticiones, edita las existentes o elimina las que ya no necesites.
          </p>

          {(error || localError) && (
            <div className="alert alert-danger d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error || localError}
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando peticiones...</p>
            </div>
          ) : petitions.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="bi bi-card-list" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              </div>
              <h5 className="text-muted mb-3">No tienes peticiones</h5>
              <p className="text-muted mb-0">Crea tu primera petición para comenzar a recibir ofertas de proveedores.</p>
            </div>
          ) : (
            <PetitionList
              petitions={petitions}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              profile={profile}
            />
          )}
        </div>
      </div>

      <CreatePetitionForm
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        petitionToEdit={editingPetition}
        customerProfile={profile}
        onPetitionCreatedOrUpdated={handlePetitionCreatedOrUpdated}
      />

      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        body="¿Estás seguro de que quieres eliminar esta petición? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default PetitionsPage;
