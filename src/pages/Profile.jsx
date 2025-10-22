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
    <div className="profile-page fade-in-up">
      <div className="social-card">
        <div className="feed-card-header">
          <h1 className="feed-title">
            <i className="bi bi-person-circle me-2"></i>
            Mi Perfil
          </h1>
        </div>
        <div className="feed-card-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;