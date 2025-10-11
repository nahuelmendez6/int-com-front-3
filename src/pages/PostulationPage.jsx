import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostulationForm from '../components/postulations/PostulationForm';
import { createPostulation } from '../services/postulation.service.js';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

const PostulationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth(); 
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
      budgets: [formData.budget],
    };

    try {
      setSubmitting(true);
      await createPostulation(postulationData);
      navigate('/feed'); 
    } catch (err) {
      setError('Error al crear la postulación. Por favor, inténtelo de nuevo.');
      console.error(err);
    } finally {
      setSubmitting(false);
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
                paddingRight: '20px'
            }}
        >
            <PostulationForm
                petitionId={id}
                onSubmit={handleSubmit}
                error={error}
                submitting={submitting}
            />
        </div>
    </div>
  );
};

export default PostulationPage;
