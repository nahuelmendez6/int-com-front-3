import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Image, Spinner, Alert, Badge } from 'react-bootstrap';
import { getUserProfile } from '../services/profile.service.js';

const CustomerPublicProfilePage = () => {
  const { customerId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching profile for customer ID:', customerId);
        const profileData = await getUserProfile({ id_customer: customerId });
        console.log('Profile data received:', profileData);
        setProfile(profileData);
      } catch (err) {
        console.error('Error fetching customer profile:', err);
        setError('Error al cargar el perfil del cliente');
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchProfile();
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando perfil del cliente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          <Alert.Heading>Perfil no encontrado</Alert.Heading>
          <p>No se pudo encontrar el perfil del cliente solicitado.</p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              {/* Header with profile image and basic info */}
              <div className="text-center mb-4">
                <Image
                  src={`http://localhost:8000${profile.profile_image}`}
                  roundedCircle
                  className="mb-3"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                <h2 className="mb-2">
                  {profile.name} {profile.lastname}
                </h2>
                <p className="text-muted mb-3">
                  <i className="bi bi-envelope me-2"></i>
                  {profile.email}
                </p>
                <Badge bg="primary" className="fs-6">
                  <i className="bi bi-person-circle me-1"></i>
                  Cliente
                </Badge>
              </div>

              {/* Profile details */}
              <div className="row">
                <div className="col-md-6">
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">
                        <i className="bi bi-info-circle me-2"></i>
                        Información Personal
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-3">
                        <strong>Nombre completo:</strong>
                        <p className="text-muted mb-0">
                          {profile.name} {profile.lastname}
                        </p>
                      </div>
                      <div className="mb-3">
                        <strong>Email:</strong>
                        <p className="text-muted mb-0">{profile.email}</p>
                      </div>
                      {profile.phone && (
                        <div className="mb-3">
                          <strong>Teléfono:</strong>
                          <p className="text-muted mb-0">{profile.phone}</p>
                        </div>
                      )}
                      {profile.address && (
                        <div className="mb-3">
                          <strong>Dirección:</strong>
                          <p className="text-muted mb-0">{profile.address}</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>

                <div className="col-md-6">
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">
                        <i className="bi bi-calendar-check me-2"></i>
                        Información de Cuenta
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-3">
                        <strong>Miembro desde:</strong>
                        <p className="text-muted mb-0">
                          {new Date(profile.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="mb-3">
                        <strong>Estado de la cuenta:</strong>
                        <p className="text-muted mb-0">
                          <Badge bg={profile.is_active ? 'success' : 'secondary'}>
                            {profile.is_active ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </p>
                      </div>
                      {profile.last_login && (
                        <div className="mb-3">
                          <strong>Último acceso:</strong>
                          <p className="text-muted mb-0">
                            {new Date(profile.last_login).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              </div>

              {/* Additional information if available */}
              {profile.bio && (
                <Card className="mt-4">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">
                      <i className="bi bi-person-lines-fill me-2"></i>
                      Biografía
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted mb-0">{profile.bio}</p>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerPublicProfilePage;
