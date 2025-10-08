import React, { useState, useEffect } from 'react';
import { getPetitions } from '../services/petitions.service.js';
import PetitionList from '../components/petitions/PetitionList';
import CreatePetitionForm from '../components/petitions/CreatePetitionForm';
import { useAuth } from '../hooks/useAuth.js';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Button } from 'react-bootstrap';

const PetitionsPage = () => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePetitionModal, setShowCreatePetitionModal] = useState(false);
  const { profile } = useAuth();

  const fetchPetitions = async () => {
    try {
      const data = await getPetitions();
      setPetitions(data);
    } catch (err) {
      setError('Error al cargar las peticiones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, []);

  const handleShowCreatePetitionModal = () => setShowCreatePetitionModal(true);
  const handleCloseCreatePetitionModal = () => setShowCreatePetitionModal(false);

  const handlePetitionCreatedOrUpdated = () => {
    handleCloseCreatePetitionModal();
    fetchPetitions(); // Re-fetch petitions to update the list
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
            <h1>Mis Peticiones</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <Button variant="primary" onClick={handleShowCreatePetitionModal} className="mb-3">
                Crear Nueva Petición
            </Button>

            {loading ? (
                <p>Cargando peticiones...</p>
            ) : (
                <PetitionList petitions={petitions} />
            )}

            <CreatePetitionForm
                show={showCreatePetitionModal}
                onHide={handleCloseCreatePetitionModal}
                customerProfile={profile}
                onPetitionCreatedOrUpdated={handlePetitionCreatedOrUpdated}
            />
        </div>
    </div>
  );
};

export default PetitionsPage;