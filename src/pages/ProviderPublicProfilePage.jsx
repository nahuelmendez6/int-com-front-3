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
    <div className="container mt-5">
        <div className="card">
          <div className="card-header text-center">
            <h3>Perfil de {provider.user.name} {provider.user.lastname}</h3>
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
    </div>
  );
};

export default ProviderPublicProfilePage;
