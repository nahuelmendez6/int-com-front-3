import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostulationForm from '../components/postulations/PostulationForm';
import { createPostulation } from '../services/postulation.service.js';
import { useAuth } from '../hooks/useAuth';

const PostulationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleCloseForm = () => {
    setShowForm(false);
    navigate(-1); // Go back to the previous page
  };

  const handleSubmit = async (formData) => {
    if (!profile || !profile.profile || !profile.profile.id_provider) {
      setError('No se pudo obtener el ID del proveedor. Asegúrese de haber iniciado sesión.');
      return;
    }

    const postulationData = {
      id_petition: parseInt(id, 10),
      id_provider: profile.profile.id_provider,
      winner: false,
      proposal: formData.proposal,
      id_state: 1,
      budgets: formData.budgets,
      materials: formData.materials,
    };

    try {
      setSubmitting(true);
      setError(null);
      await createPostulation(postulationData);
      handleCloseForm();
    } catch (err) {
      setError('Error al crear la postulación. Por favor, inténtelo de nuevo.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="postulation-page">
      {/* The page content can go here, maybe details about the petition */}
      {/* The form is now a modal controlled by this page */}
      <PostulationForm
        show={showForm}
        handleClose={handleCloseForm}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
        providerId={profile?.profile?.id_provider}
      />
    </div>
  );
};

export default PostulationPage;