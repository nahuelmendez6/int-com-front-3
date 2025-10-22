import { useAuth } from '../hooks/useAuth.js';
import ProviderProfile from '../components/ProviderProfile';
import CustomerProfile from '../components/CustomerProfile';

const Profile = () => {
  const { profile, loading } = useAuth();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando perfil...</p>
          </div>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="alert alert-danger">
          No se pudo cargar el perfil del usuario.
        </div>
      );
    }

    return profile.role === 'provider' ? (
      <ProviderProfile userData={profile} />
    ) : (
      <CustomerProfile userData={profile} />
    );
  };

  return (
    <div className="profile-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          <h1 className="card-title mb-4">
            <i className="bi bi-person-circle me-2"></i>
            Mi Perfil
          </h1>
          <p className="text-muted mb-4">
            Gestiona tu información personal, configuración de cuenta y preferencias de la plataforma.
          </p>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;