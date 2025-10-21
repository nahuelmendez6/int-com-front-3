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

  return (
    <div className="petitions-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mis Peticiones</h1>
        <Button variant="primary" onClick={handleCreateClick}>
          <i className="bi bi-plus-lg me-2"></i> Nueva Petición
        </Button>
      </div>

      {(error || localError) && (
        <div className="alert alert-danger">{error || localError}</div>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">Peticiones Activas</Card.Title>

          {loading ? (
            <p>Cargando peticiones...</p>
          ) : petitions.length === 0 ? (
            <p>No has publicado ninguna petición.</p>
          ) : (
            <PetitionList
              petitions={petitions}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              profile={profile}
            />
          )}
        </Card.Body>
      </Card>

      <CreatePetitionForm
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        petitionToEdit={editingPetition}
        customerProfile={profile}
        onPetitionCreatedOrUpdated={() => refetch()}
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
