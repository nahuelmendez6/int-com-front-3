import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { usePetitions } from '../hooks/usePetitions.js';
import { useCustomerOffers } from '../hooks/useCustomerOffers.js';
import ProviderFeed from '../components/feed/ProviderFeed.jsx';
import CustomerFeed from '../components/feed/CustomerFeed';
import DefaultFeed from '../components/feed/DefaultFeed';
import './pages-styles/Feed.css';

const Feed = () => {
  const { profile, loading: authLoading } = useAuth();
  const { petitions, loading: petitionsLoading, error: petitionsError } = usePetitions(profile);
  const { offers, loading: offersLoading, error: offersError } = useCustomerOffers(profile, authLoading);
  
  if (authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando tu feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          <h1 className="card-title mb-4">
            <i className="bi bi-house-door me-2"></i>
            Feed Principal
          </h1>
          <p className="text-muted mb-4">
            Aquí encontrarás las últimas peticiones y ofertas disponibles según tu rol en la plataforma.
          </p>
          <div className="feed-content">
            {profile?.role === 'provider' && (
              <ProviderFeed
                petitions={petitions}
                loading={petitionsLoading}
                error={petitionsError}
                profile={profile}
              />
            )}

            {profile?.role === 'customer' && (
              <CustomerFeed
                offers={offers}
                loading={offersLoading}
                error={offersError}
              />
            )}

            {!profile?.role && <DefaultFeed />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
