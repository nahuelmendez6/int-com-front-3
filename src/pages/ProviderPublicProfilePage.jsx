import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProviderProfileById } from '../services/profile.service';

const ProviderPublicProfilePage = () => {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setLoading(true);
        const data = await getProviderProfileById(providerId);
        setProvider(data);
      } catch (err) {
        setError('No se pudo cargar el perfil del proveedor.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [providerId]);

  if (loading) return <div className="text-center mt-5">Cargando perfil...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!provider) return null;

  return (
    <div className="provider-public-profile-page">
      {loading ? (
        <div className="text-center mt-5">Cargando perfil...</div>
      ) : error ? (
        <div className="alert alert-danger mt-5">{error}</div>
      ) : provider ? (
        <div className="card">
          <div className="card-body text-center">
            <img 
              src={provider.profile_image 
                    ? `http://localhost:8000${provider.profile_image}` 
                    : 'https://via.placeholder.com/150'}
              alt={`${provider.name} ${provider.lastname}`}
              className="rounded-circle mb-3" 
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <h2 className="card-title">{provider.name} {provider.lastname}</h2>
            <p className="text-muted">{provider.email}</p>

            {provider.bio && (
              <div className="mt-4">
                <h4>Biografía</h4>
                <p>{provider.bio}</p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProviderPublicProfilePage;
