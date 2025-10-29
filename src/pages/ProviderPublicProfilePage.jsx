import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProviderProfileById } from '../services/profile.service';
import portfolioService from '../services/portfolio.service';
import gradesService from '../services/grades.service.js';
import PortfolioList from '../components/portfolio/PortfolioList';
import GradeList from '../components/grades/GradeList';
import useAverageRating from '../hooks/useAverageRating';
import StarRating from '../components/common/StarRating';
import { useMessageContext } from '../contexts/MessageContext';

const ProviderPublicProfilePage = () => {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { createConversation } = useMessageContext();

  const { averageRating, loading: loadingRating, error: errorRating } = useAverageRating(providerId);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [profileData, portfolioData, gradesData] = await Promise.all([
          getProviderProfileById(providerId),
          portfolioService.getPortfoliosByProvider(providerId),
          gradesService.getGradesByProvider(providerId)
        ]);
        
        setProvider(profileData);
        setPortfolio(portfolioData.data);
        setGrades(gradesData);

      } catch (err) {
        setError('No se pudo cargar el perfil completo del proveedor.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [providerId]);

  if (loading || loadingRating) return <div className="text-center mt-5">Cargando perfil...</div>;
  if (error || errorRating) return <div className="alert alert-danger mt-5">{error || errorRating}</div>;
  if (!provider) return null;

  return (
    <div className="container mt-5">
      {/* --- Perfil Principal --- */}
      <div className="card mb-5">
        <div className="card-header text-center">
          <h3>
            Perfil de {provider.user.name} {provider.user.lastname}
            {averageRating !== null && (
              <span className="ms-3">
                <StarRating rating={averageRating} />
              </span>
            )}
          </h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center">
              <img
                src={provider.user.profile_image
                  ? `http://localhost:8000${provider.user.profile_image}`
                  : 'https://via.placeholder.com/150'}
                alt={`${provider.user.name} ${provider.user.lastname}`}
                className="rounded-circle img-fluid mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <h4 className="card-title">{provider.user.name} {provider.user.lastname}</h4>
              <p className="text-muted">{provider.user.email}</p>
              <p className="text-muted">{provider.type_provider}</p>
              <button
                className="btn btn-outline-primary"
                onClick={async () => {
                  const targetUserId = provider?.user?.id_user || provider?.user?.id;
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
            <div className="col-md-8">
              <div className="mb-3">
                <h5>Profesión</h5>
                <p>{provider.profession}</p>
              </div>
              <div className="mb-3">
                <h5>Descripción</h5>
                <p>{provider.description}</p>
              </div>
              <div className="mb-3">
                <h5>Dirección</h5>
                <p>{provider.address}</p>
              </div>
              <div className="mb-3">
                <h5>Categorías</h5>
                {provider.categories && provider.categories.length > 0 ? (
                  <div>
                    {provider.categories.map((category, index) => (
                      <span key={index} className="badge bg-secondary me-1">{category}</span>
                    ))}
                  </div>
                ) : (
                  <p>No hay categorías especificadas.</p>
                )}
              </div>
              <div className="mb-3">
                <h5>Ciudades de Servicio</h5>
                <p>{provider.cities !== "locations.City.None" ? provider.cities : "No especificado"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Sección de Calificaciones --- */}
      <div className="mb-5">
        <GradeList grades={grades} />
      </div>

      {/* --- Sección de Portfolio --- */}
      <div className="portfolio-section">
        <h3 className="mb-4">Portfolio de Proyectos</h3>
        <PortfolioList portfolios={portfolio} isPublicView={true} />
      </div>
    </div>
  );
};

export default ProviderPublicProfilePage;
