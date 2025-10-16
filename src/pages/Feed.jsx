import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { usePetitions } from '../hooks/usePetitions.js';
import PetitionList from '../components/petitions/PetitionList';
import { getCustomerFeedOffers } from '../services/offers.service.js';
import OfferList from '../components/offers/OfferList';

const Feed = () => {
  const { profile, loading: authLoading } = useAuth();
  const { petitions: providerPetitions, loading: loadingPetitions, error } = usePetitions(profile);

  const [customerOffers, setCustomerOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [offerError, setOfferError] = useState(null);

  useEffect(() => {
    const fetchCustomerOffers = async () => {
      if (profile && profile.role === 'customer') {
        try {
          setLoadingOffers(true);
          const { data } = await getCustomerFeedOffers();
          setCustomerOffers(data);
          setOfferError(null);
        } catch (err) {
          console.error("Error fetching customer offers:", err);
          setOfferError('Error al cargar las ofertas para clientes.');
        } finally {
          setLoadingOffers(false);
        }
      } else {
        setLoadingOffers(false);
      }
    };

    if (!authLoading) fetchCustomerOffers();
  }, [profile, authLoading]);

  const renderFeedContent = () => {
    if (authLoading) return <p>Cargando perfil de usuario...</p>;

    if (profile?.role === 'provider') {
      return (
        <div className="feed-card">
          <h2 className="feed-title">Peticiones para Proveedores</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {loadingPetitions ? (
            <p>Cargando peticiones...</p>
          ) : (
            <PetitionList petitions={providerPetitions} profile={profile} />
          )}
        </div>
      );
    }

    if (profile?.role === 'customer') {
      return (
        <div className="feed-card">
          <h2 className="feed-title">Ofertas para ti</h2>
          {offerError && <div className="alert alert-danger">{offerError}</div>}
          {loadingOffers ? <p>Cargando ofertas...</p> : <OfferList offers={customerOffers} />}
        </div>
      );
    }

    return (
      <div className="feed-card">
        <h2 className="feed-title">Feed Principal</h2>
        <p className="text-muted mb-0">
          Aquí se mostrarán publicaciones, noticias y actualizaciones relevantes.
        </p>
      </div>
    );
  };

  return (
    <div className="feed-page">
      <div className="feed-content">
        {renderFeedContent()}
      </div>

      <style>{`
        .feed-page {
          width: 100%;
        }

        .feed-content {
          width: 100%;
        }

        /* 🔹 Card principal */
        .feed-card {
          background: #fff;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        .feed-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #0d6efd;
          margin-bottom: 1.5rem;
        }

        /* 🔹 Mobile */
        @media (max-width: 768px) {
          .feed-card {
            padding: 1rem;
            border-radius: 0.75rem;
          }

          .feed-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Feed;
