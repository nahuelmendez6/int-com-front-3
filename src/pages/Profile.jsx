import { useAuth } from '../hooks/useAuth.js';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
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
      <Navbar />
      <Sidebar />
      <div 
        className="container-fluid"
        style={{
          paddingTop: '80px',
          paddingLeft: '290px',
          paddingRight: '20px',
          width: '100%',
          maxWidth: 'none'
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
    </div>
  );
};

export default Profile;