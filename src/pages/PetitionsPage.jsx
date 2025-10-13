import React, { useState, useEffect, useCallback } from 'react';
import { getPetitions, deletePetition } from '../services/petitions.service.js';
import PetitionList from '../components/petitions/PetitionList';
import CreatePetitionForm from '../components/petitions/CreatePetitionForm';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { useAuth } from '../hooks/useAuth.js';
import Sidebar from '../components/Sidebar';
import { Button, Card } from 'react-bootstrap';

const PetitionsPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePetitionModal, setShowCreatePetitionModal] = useState(false);
  const [editingPetition, setEditingPetition] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [petitionToDeleteId, setPetitionToDeleteId] = useState(null);
  const { profile } = useAuth();

  const fetchPetitions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPetitions();
      console.log("Fetched Petitions:", data);
      setPetitions(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las peticiones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPetitions();
  }, [fetchPetitions]);

  const handleShowCreatePetitionModal = () => {
    setEditingPetition(null);
    setShowCreatePetitionModal(true);
  };
  const handleCloseCreatePetitionModal = () => setShowCreatePetitionModal(false);

  const handlePetitionCreatedOrUpdated = () => {
    handleCloseCreatePetitionModal();
    fetchPetitions(); // Re-fetch petitions to update the list
  };

  const handleShowEditModal = (petition) => {
    setEditingPetition(petition);
    setShowCreatePetitionModal(true);
  };

  const handleDeletePetition = (petitionId) => {
    setPetitionToDeleteId(petitionId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePetition = async () => {
    if (petitionToDeleteId) {
      try {
        await deletePetition(petitionToDeleteId);
        fetchPetitions(); // Recargar lista
      } catch (err) {
        setError('Error al eliminar la petición.');
      } finally {
        setShowDeleteConfirmation(false);
        setPetitionToDeleteId(null);
      }
    }
  };

  return (
    <div className="min-vh-100 bg-light">
        <Sidebar />
        <div 
            className="container-fluid main-content"
            style={{
                paddingTop: '10px',
                paddingLeft: '280px',
                paddingRight: '10px',
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mis Peticiones</h1>
                <Button variant="primary" onClick={handleShowCreatePetitionModal}>
                    <i className="bi bi-plus-lg me-2"></i>
                    Crear Nueva Petición
                </Button>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="mb-3">Peticiones Activas</Card.Title>
                    {loading ? (
                        <p>Cargando peticiones...</p>
                    ) : (
                        <PetitionList 
                            petitions={petitions} 
                            onEdit={handleShowEditModal} 
                            onDelete={handleDeletePetition} 
                        />
                    )}
                </Card.Body>
            </Card>

            <CreatePetitionForm
                show={showCreatePetitionModal}
                onHide={handleCloseCreatePetitionModal}
                petitionToEdit={editingPetition}
                customerProfile={profile}
                onPetitionCreatedOrUpdated={handlePetitionCreatedOrUpdated}
            />

            <ConfirmationModal
                show={showDeleteConfirmation}
                onHide={() => setShowDeleteConfirmation(false)}
                onConfirm={confirmDeletePetition}
                title="Confirmar Eliminación"
                body="¿Estás seguro de que quieres eliminar esta petición? Esta acción no se puede deshacer."
            />
        </div>
        <style>{`
            .main-content {
                width: 100%;
                max-width: none;
                margin-left: 0;
                margin-right: 0;
            }
            @media (max-width: 767.98px) {
              .main-content {
                padding-left: 10px !important;
                padding-right: 10px !important;
                padding-top: 10px !important;
              }
            }
        `}</style>
    </div>
  );
};

export default PetitionsPage;