import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ProviderProfile from '../components/ProviderProfile';
import CustomerProfile from '../components/CustomerProfile';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos del usuario
    // En una aplicación real, esto vendría de una API
    const mockUserData = {
      role: "provider", // Cambiar a "customer" para probar el perfil de cliente
      user: {
        id_user: 15,
        name: "Alejandro",
        lastname: "Maturano",
        email: "alejandromaturano42@gmail.com",
        profile_image: "http://127.0.0.1:8000/media/profiles/Screenshot_from_2025-08-13_15-48-42.png"
      },
      profile: {
        id_provider: 13,
        categories: [
          {
            id_category: 14,
            name: "Servicios Profesionales"
          },
          {
            id_category: 1,
            name: "Construcción y Reparaciones"
          }
        ],
        type_provider: {
          id_type_provider: 1,
          name: "Particular"
        },
        profession: {
          id_profession: 19,
          name: "Arquitecto"
        },
        description: "Soy Alejandro, arquitecto profesional.",
        address: {
          id_address: 24,
          street: "9 de Julio",
          number: null,
          floor: null,
          apartment: null,
          postal_code: null,
          city: 22,
          city_detail: {
            id_city: 22,
            name: "San Martín",
            postal_code: "5400",
            date_create: "2025-07-10T14:52:53Z",
            date_update: "2025-07-10T14:52:53Z",
            department: 9,
            providers: [13]
          },
          date_create: null,
          date_update: null
        }
      }
    };

    // Simular delay de carga
    setTimeout(() => {
      setUserData(mockUserData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpdateUser = (updatedData) => {
    setUserData(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <Sidebar />
        <div 
          className="container-fluid feed-container"
          style={{
            paddingTop: '80px',
            paddingLeft: '290px',
            paddingRight: '20px',
            marginLeft: '0',
            marginRight: '0',
            width: '100%',
            maxWidth: 'none'
          }}
        >
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <Sidebar />
      
      <div 
        className="container-fluid feed-container"
        style={{
          paddingTop: '80px',
          paddingLeft: '290px',
          paddingRight: '20px',
          marginLeft: '0',
          marginRight: '0',
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
                
                {userData?.role === 'provider' ? (
                  <ProviderProfile 
                    userData={userData} 
                    onUpdate={handleUpdateUser}
                  />
                ) : (
                  <CustomerProfile 
                    userData={userData} 
                    onUpdate={handleUpdateUser}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ajustes responsivos para móviles */}
      <style>{`
        @media (max-width: 767.98px) {
          .feed-container {
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-top: 60px !important;
            width: 100% !important;
            max-width: none !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .card-body {
            padding: 1rem !important;
          }
          .h4 {
            font-size: 1.25rem !important;
          }
          .btn {
            font-size: 0.875rem !important;
          }
          .form-label {
            font-size: 0.875rem !important;
            font-weight: 600 !important;
          }
          .form-control, .form-select {
            font-size: 0.875rem !important;
          }
          .card-header h5 {
            font-size: 1rem !important;
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
        @media (max-width: 575.98px) {
          .d-flex.flex-column.flex-sm-row {
            flex-direction: column !important;
          }
          .gap-2 > * {
            margin-bottom: 0.5rem !important;
          }
          .gap-2 > *:last-child {
            margin-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
