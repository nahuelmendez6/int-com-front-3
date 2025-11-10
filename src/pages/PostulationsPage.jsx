import React, { useState, useEffect, useCallback } from 'react';
import ProviderPostulationList from '../components/postulations/ProviderPostulationList';
import PostulationForm from '../components/postulations/PostulationForm';
import { getProviderPostulations, updatePostulation } from '../services/postulation.service.js';
import { useAuth } from '../hooks/useAuth';

const PostulationsPage = () => {
  const { profile } = useAuth();
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

  console.log(postulations);

  return (
    <div className="postulations-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          <h1 className="card-title mb-4">
            <i className="bi bi-journal-text me-2"></i>
            Mis Postulaciones
          </h1>
          <p className="text-muted mb-4">
            Gestiona las postulaciones que has realizado a peticiones de clientes. Puedes editar o eliminar tus postulaciones.
          </p>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando postulaciones...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          ) : postulations.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="bi bi-journal-text" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
              </div>
              <h5 className="text-muted mb-3">No tienes postulaciones</h5>
              <p className="text-muted mb-0">Postúlate a peticiones de clientes para comenzar a ofrecer tus servicios.</p>
            </div>
          ) : (
            <ProviderPostulationList 
              postulations={postulations} 
              onEdit={handleShowEditModal} 
              onDelete={handleDelete} 
            />
          )}

          <PostulationForm 
            show={showModal}
            handleClose={handleCloseModal}
            onSubmit={handleSubmit}
            initialData={editingPostulation}
            submitting={submitting}
            error={error}
            providerId={profile?.profile?.id_provider}
          />
        </div>
      </div>
    </div>
  );
};

export default PostulationsPage;
