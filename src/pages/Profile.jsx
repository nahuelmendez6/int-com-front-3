import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ProviderProfile from '../components/ProviderProfile';
import CustomerProfile from '../components/CustomerProfile';

import { useAuth } from '../hooks/useAuth.js';

const Profile = () => {
  
  const { profile, loading } = useAuth();
  
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
    )
  }

  if (!profile) {
        return (
      <div className="min-vh-100 bg-light">
        <Navbar />
        <Sidebar />
        <div className="container-fluid" style={{ paddingTop: '80px', paddingLeft: '290px' }}>
          <div className="alert alert-danger">
            No se pudo cargar el perfil del usuario.
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

                {profile.role === 'provider' ? (
                  <ProviderProfile userData={profile} />
                ) : (
                  <CustomerProfile userData={profile} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

};

export default Profile;
