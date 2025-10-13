import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth.js';
import { getProviderFeedPetitions } from '../services/petitions.service.js';
import PetitionList from '../components/petitions/PetitionList';
import { getCustomerFeedOffers } from '../services/offers.service.js';
import OfferList from '../components/offers/OfferList';

const Feed = () => {
  const { profile, loading: authLoading } = useAuth();
  const [providerPetitions, setProviderPetitions] = useState([]);
  const [customerOffers, setCustomerOffers] = useState([]);
  const [loadingPetitions, setLoadingPetitions] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderPetitions = async () => {
      if (profile && profile.role === 'provider') {
        try {
          setLoadingPetitions(true);
          const data = await getProviderFeedPetitions();
          setProviderPetitions(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching provider petitions:", err);
          setError('Error al cargar las peticiones para proveedores.');
        } finally {
          setLoadingPetitions(false);
        }
      } else {
        setLoadingPetitions(false);
      }
    };

    const fetchCustomerOffers = async () => {
      if (profile && profile.role === 'customer') {
        try {
          setLoadingOffers(true);
          const { data } = await getCustomerFeedOffers();
          setCustomerOffers(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching customer offers:", err);
          setError('Error al cargar las ofertas para clientes.');
        } finally {
          setLoadingOffers(false);
        }
      } else {
        setLoadingOffers(false);
      }
    };

    if (!authLoading) {
      fetchProviderPetitions();
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
          <h1 className="card-title mb-4">Ofertas para ti</h1>  
          <div className="card-body p-4">
            
            {error && <div className="alert alert-danger">{error}</div>}
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
            {/* Contenido placeholder para otros roles o sin login */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h5 className="card-title">Publicación 1</h5>
                    <p className="card-text">
                      Este es un ejemplo de publicación que aparecerá en el feed.
                    </p>
                    <small className="text-muted">Hace 2 horas</small>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h5 className="card-title">Publicación 2</h5>
                    <p className="card-text">
                      Otra publicación de ejemplo para mostrar el layout del feed.
                    </p>
                    <small className="text-muted">Hace 4 horas</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Sidebar flotante */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div 
        className="container-fluid feed-container"
        style={{
          paddingTop: '10px', // Espacio superior
          paddingLeft: '280px', // Espacio para el sidebar en desktop (250px + 20px margen + 10px gap)
          paddingRight: '10px',
          marginLeft: '0',
          marginRight: '0',
          width: '100%',
          maxWidth: 'none' // Permitir que use todo el ancho disponible
        }}
      >
        <div className="row">
          <div className="col-12">
            {renderFeedContent()}
          </div>
        </div>
      </div>
      
      {/* Ajustes responsivos para móviles */}
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
