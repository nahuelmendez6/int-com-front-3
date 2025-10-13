import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
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

    if (!authLoading) {
      fetchCustomerOffers();
    }
  }, [profile, authLoading]);

  const renderFeedContent = () => {
    if (authLoading) {
      return <p>Cargando perfil de usuario...</p>;
    }

    if (profile && profile.role === 'provider') {
      return (
        <div className="card shadow rounded-3">
          <div className="card-body p-4">
            <h1 className="card-title mb-4">Peticiones para Proveedores</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {loadingPetitions ? (
              <p>Cargando peticiones...</p>
            ) : ( 
              <PetitionList petitions={providerPetitions} profile={profile} />
            )}
          </div>
        </div>
      );
    } else if (profile && profile.role === 'customer') {
      return (
        <div className="card shadow rounded-3">
          <div className="card-body p-4">
            <h1 className="card-title mb-4">Ofertas para ti</h1>  
            {offerError && <div className="alert alert-danger">{offerError}</div>}
            {loadingOffers ? (
              <p>Cargando ofertas...</p>
            ) : (
              <OfferList offers={customerOffers} />
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="card shadow rounded-3">
          <div className="card-body p-4">
            <h1 className="card-title mb-4">Feed Principal</h1>
            <p className="text-muted">
              Este es el espacio principal donde irá el contenido del feed.
              Aquí se mostrarán las publicaciones, noticias y actualizaciones.
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Sidebar />
      <div 
        className="container-fluid feed-container"
        style={{
          paddingTop: '10px', 
          paddingLeft: '280px', 
          paddingRight: '10px',
          marginLeft: '0',
          marginRight: '0',
          width: '100%',
          maxWidth: 'none'
        }}
      >
        <div className="row">
          <div className="col-12">
            {renderFeedContent()}
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 767.98px) {
          .feed-container {
            padding-left: 10px !important;
            padding-right: 10px !important;
            padding-top: 10px !important;
            width: 100% !important;
            max-width: none !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
        @media (min-width: 768px) {
          .feed-container {
            width: 100% !important;
            max-width: none !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Feed;