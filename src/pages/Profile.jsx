import { useAuth } from '../hooks/useAuth.js';
import Sidebar from '../components/Sidebar';
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
    <div className="min-vh-100 bg-light">
      <Sidebar />
      <div 
        className="container-fluid main-content"
        style={{
          paddingTop: '10px',
          paddingLeft: '280px',
          paddingRight: '10px',
        }}
      >
        <div className="row">
          <div className="col-12">
            <div className="card shadow rounded-3">
              <div className="card-body p-4">
                <h1 className="card-title mb-4">
                  <i className="bi bi-person-circle me-2"></i>
                  Mi Perfil
                </h1>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .main-content {
            width: 100%;
            max-width: none;
            margin-left: 0;
            margin-right: 0;
        }
        @media (max-width: 767.98px) {
          .main-content {
            padding-left: 10px !important;
            padding-right: 10px !important;
            padding-top: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;