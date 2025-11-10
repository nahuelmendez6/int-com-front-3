import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../services/profile.service.js';
import { useMessageContext } from '../contexts/MessageContext';
import gradesService from '../services/grades.service.js';
import CustomerGradeList from '../components/grades/CustomerGradeList';
import RatingCustomerForm from '../components/grades/RatingCustomerForm';
import StarRating from '../components/common/StarRating';
import { useAuth } from '../hooks/useAuth';

const CustomerPublicProfilePage = () => {
  const { customerId } = useParams();
  const [profile, setProfile] = useState(null);
  const [grades, setGrades] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { createConversation } = useMessageContext();
  const { user } = useAuth();

  const fetchGrades = useCallback(async () => {
    try {
      // Obtener id_user del perfil
      const userId = profile?.id_user || profile?.id;
      if (!userId) {
        console.error('No se encontró id_user en el perfil');
        return;
      }
      
      const response = await gradesService.getGradesByCustomerUserId(userId);
      const gradesData = response.results || response || [];
      setGrades(gradesData);
      if (gradesData.length > 0) {
        const totalRating = gradesData.reduce((acc, grade) => acc + grade.rating, 0);
        setAverageRating(totalRating / gradesData.length);
      } else {
        setAverageRating(0);
      }
    } catch (err) {
      console.error('Error fetching customer grades:', err);
      setError('Error al cargar las calificaciones del cliente');
    }
  }, [profile]);

  useEffect(() => {
    const fetchProfileAndGrades = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const profileData = await getUserProfile({ id_customer: customerId });
        setProfile(profileData);
        
      } catch (err) {
        console.error('Error fetching customer profile:', err);
        setError('Error al cargar el perfil del cliente');
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchProfileAndGrades();
    }
  }, [customerId]);

  // Cargar calificaciones cuando el perfil esté disponible
  useEffect(() => {
    if (profile) {
      fetchGrades();
    }
  }, [profile, fetchGrades]);

  if (loading) {
    return <div className="text-center mt-5">Cargando perfil...</div>;
  }

  if (error && !profile) {
    return <div className="alert alert-danger mt-5">{error}</div>;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mt-5">
      {/* --- Perfil Principal --- */}
      <div className="card mb-5">
        <div className="card-header text-center">
          <h3>
            Perfil de {profile.name} {profile.lastname}
            {averageRating !== null && averageRating > 0 && (
              <span className="ms-3">
                <StarRating rating={averageRating} readOnly />
                <span className="ms-2 text-muted">({grades.length} calificaciones)</span>
              </span>
            )}
          </h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center">
              <img
                src={profile.profile_image
                  ? `http://localhost:8000${profile.profile_image}`
                  : 'https://via.placeholder.com/150'}
                alt={`${profile.name} ${profile.lastname}`}
                className="rounded-circle img-fluid mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h4 className="card-title">{profile.name} {profile.lastname}</h4>
              <p className="text-muted">{profile.email}</p>
              <span className="badge bg-primary mb-3">Cliente</span>
              <div className="mt-3">
                <button
                  className="btn btn-outline-primary"
                  onClick={async () => {
                    const targetUserId = profile?.id_user || profile?.id;
                    if (!targetUserId) return;
                    try {
                      const conv = await createConversation(targetUserId);
                      const conversationId = conv?.id || conv?.id_conversation || conv?.conversation_id;
                      if (!conversationId) return;
                      window.dispatchEvent(new CustomEvent('openMessages', { detail: { conversationId } }));
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <i className="bi bi-chat-dots me-1"></i>
                  Enviar mensaje
                </button>
              </div>
            </div>
            <div className="col-md-8">
              <div className="mb-3">
                <h5>Email</h5>
                <p>{profile.email}</p>
              </div>
              {profile.phone && (
                <div className="mb-3">
                  <h5>Teléfono</h5>
                  <p>{profile.phone}</p>
                </div>
              )}
              {profile.address && (
                <div className="mb-3">
                  <h5>Dirección</h5>
                  <p>{profile.address}</p>
                </div>
              )}
              {profile.bio && (
                <div className="mb-3">
                  <h5>Biografía</h5>
                  <p>{profile.bio}</p>
                </div>
              )}
              {profile.created_at && (
                <div className="mb-3">
                  <h5>Miembro desde</h5>
                  <p>
                    {new Date(profile.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Sección de Calificaciones --- */}
      <div className="mb-5">
        <CustomerGradeList grades={grades} />
      </div>

      {/* --- Formulario de Calificación (solo para proveedores) --- */}
      {user && user.role === 'provider' && (
        <div className="mb-5">
          <RatingCustomerForm customerId={customerId} onRatingSuccess={fetchGrades} />
        </div>
      )}

      {error && <div className="alert alert-danger mt-4">{error}</div>}
    </div>
  );
};

export default CustomerPublicProfilePage;
