import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostulationForm from '../components/postulations/PostulationForm';
import { createPostulation } from '../services/postulation.service.js';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar.jsx';

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
      budgets: formData.budget,
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
    <div className="min-vh-100 bg-light">
      <Sidebar />
      <div
        className="container-fluid main-content"
        style={{
          paddingTop: '10px',
          paddingLeft: '280px',
          paddingRight: '10px'
        }}
      >
        {/* The page content can go here, maybe details about the petition */}
        {/* The form is now a modal controlled by this page */}
        <PostulationForm
          show={showForm}
          handleClose={handleCloseForm}
          onSubmit={handleSubmit}
          error={error}
          submitting={submitting}
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

export default PostulationPage;