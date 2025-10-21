import React, { useState, useEffect, useCallback } from 'react';
import PostulationList from '../components/postulations/PostulationList';
import PostulationForm from '../components/postulations/PostulationForm';
import { getProviderPostulations, updatePostulation } from '../services/postulation.service.js';

const PostulationsPage = () => {
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPostulation, setEditingPostulation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPostulations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProviderPostulations();
      setPostulations(data.filter(p => !p.is_deleted)); // Filter out deleted postulations
      setError(null);
    } catch (err) {
      setError('Error al cargar las postulaciones.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPostulations();
  }, [fetchPostulations]);

  const handleShowEditModal = (postulation) => {
    setEditingPostulation(postulation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPostulation(null);
  };

  const handleSubmit = async (formData) => {
    if (!editingPostulation) return;
    setSubmitting(true);
    setError(null);
    try {
      await updatePostulation(editingPostulation.id_postulation, formData);
      handleCloseModal();
      fetchPostulations(); // Refresh the list
    } catch (err) {
      setError('Error al actualizar la postulación.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postulationId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta postulación? Esta acción no se puede deshacer.')) {
      setError(null);
      try {
        await updatePostulation(postulationId, { is_deleted: true });
        fetchPostulations(); // Refresh the list
      } catch (err) {
        setError('Error al eliminar la postulación.');
      }
    }
  };

  return (
    <div className="offers-page"> 
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mis Postulaciones</h1>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Postulaciones Realizadas</h5>
          {loading && <p>Cargando postulaciones...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && 
            <PostulationList 
              postulations={postulations} 
              onEdit={handleShowEditModal} 
              onDelete={handleDelete} 
            />
          }
        </div>
      </div>

      <PostulationForm 
        show={showModal}
        handleClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingPostulation}
        submitting={submitting}
        error={error}
      />
    </div>
  );
};

export default PostulationsPage;
