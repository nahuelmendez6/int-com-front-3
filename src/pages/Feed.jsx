import React from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { usePetitions } from '../hooks/usePetitions.js';
import { useCustomerOffers } from '../hooks/useCustomerOffers.js';
import ProviderFeed from '../components/feed/ProviderFeed.jsx';
import CustomerFeed from '../components/feed/CustomerFeed';
import DefaultFeed from '../components/feed/DefaultFeed';
import './pages-styles/Feed.css'; // estilos movidos

const Feed = () => {
  const { profile, loading: authLoading } = useAuth();
  const { petitions, loading: petitionsLoading, error: petitionsError } = usePetitions(profile);
  const { offers, loading: offersLoading, error: offersError } = useCustomerOffers(profile, authLoading);

  if (authLoading) return <p>Cargando perfil de usuario...</p>;

  return (
    <div className="feed-page">
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
  );
};

export default Feed;
