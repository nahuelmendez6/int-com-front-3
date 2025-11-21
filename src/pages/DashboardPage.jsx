import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { getDashboard } from '../services/profile.service.js';
import './pages-styles/Dashboard.css';

const DashboardPage = () => {
  const { profile, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboard();
        setDashboardData(data);
        console.log('Dashboard data:', data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err.response?.data?.detail || err.message || 'Error al cargar el dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDashboard();
    }
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const isProvider = dashboardData.role === 'provider';
  const isCustomer = dashboardData.role === 'customer';

  return (
    <div className="dashboard-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          <h1 className="card-title mb-4">
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </h1>
          <p className="text-muted mb-4">
            Resumen completo de tu actividad en la plataforma
          </p>

          {isProvider && (
            <div className="dashboard-content">
              {/* Resumen de Postulaciones */}
              <div className="dashboard-section">
                <h3 className="section-title">
                  <i className="bi bi-journal-text me-2"></i>
                  Postulaciones
                </h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{dashboardData.summary.postulations.total}</div>
                    <div className="stat-label">Total</div>
                  </div>
                  <div className="stat-card stat-success">
                    <div className="stat-value">{dashboardData.summary.postulations.approved}</div>
                    <div className="stat-label">Aprobadas</div>
                  </div>
                  <div className="stat-card stat-warning">
                    <div className="stat-value">{dashboardData.summary.postulations.pending}</div>
                    <div className="stat-label">Pendientes</div>
                  </div>
                  <div className="stat-card stat-primary">
                    <div className="stat-value">{dashboardData.summary.postulations.winners}</div>
                    <div className="stat-label">Ganadoras</div>
                  </div>
                </div>
              </div>

              {/* Calificaciones */}
              <div className="dashboard-section">
                <h3 className="section-title">
                  <i className="bi bi-star-fill me-2"></i>
                  Calificaciones
                </h3>
                <div className="stats-grid">
                  <div className="stat-card stat-primary">
                    <div className="stat-value">
                      {dashboardData.summary.ratings.average?.toFixed(1) || 'N/A'}
                    </div>
                    <div className="stat-label">Promedio</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{dashboardData.summary.ratings.total_reviews}</div>
                    <div className="stat-label">Total de Reseñas</div>
                  </div>
                </div>
              </div>

              {/* Oportunidades */}
              <div className="dashboard-section">
                <h3 className="section-title">
                  <i className="bi bi-briefcase me-2"></i>
                  Oportunidades
                </h3>
                <div className="stats-grid">
                  <div className="stat-card stat-info">
                    <div className="stat-value">{dashboardData.summary.opportunities.active_petitions}</div>
                    <div className="stat-label">Peticiones Activas</div>
                  </div>
                  <div className="stat-card stat-info">
                    <div className="stat-value">{dashboardData.summary.opportunities.active_offers}</div>
                    <div className="stat-label">Ofertas Activas</div>
                  </div>
                </div>
              </div>

              {/* Comunicaciones */}
              <div className="dashboard-section">
                <h3 className="section-title">
                  <i className="bi bi-chat-dots me-2"></i>
                  Comunicaciones
                </h3>
                <div className="stats-grid">
                  <div className="stat-card stat-warning">
                    <div className="stat-value">{dashboardData.summary.communications.unread_messages}</div>
                    <div className="stat-label">Mensajes no leídos</div>
                  </div>
                  <div className="stat-card stat-warning">
                    <div className="stat-value">{dashboardData.summary.communications.unread_notifications}</div>
                    <div className="stat-label">Notificaciones no leídas</div>
                  </div>
                </div>
              </div>

              {/* Postulaciones Recientes */}
              {dashboardData.recent_postulations && dashboardData.recent_postulations.length > 0 && (
                <div className="dashboard-section">
                  <h3 className="section-title">
                    <i className="bi bi-clock-history me-2"></i>
                    Postulaciones Recientes
                  </h3>
                  <div className="recent-list">
                    {dashboardData.recent_postulations.map((post) => (
                      <div key={post.id_postulation} className="recent-item">
                        <div className="recent-item-header">
                          <span className="recent-item-id">#{post.id_postulation}</span>
                          <span className={`badge ${post.winner ? 'bg-success' : 'bg-secondary'}`}>
                            {post.winner ? 'Ganadora' : post.id_state__name}
                          </span>
                        </div>
                        <div className="recent-item-meta">
                          <span>Petición #{post.id_petition}</span>
                          <span>{new Date(post.date_create).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {isCustomer && (
            <div className="dashboard-content">
              {/* Resumen de Peticiones */}
              <div className="dashboard-section">
                <h3 className="section-title">
                  <i className="bi bi-card-list me-2"></i>
                  Peticiones
                </h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{dashboardData.summary.petitions.total}</div>
                    <div className="stat-label">Total</div>
                  </div>
                  <div className="stat-card stat-success">
                    <div className="stat-value">{dashboardData.summary.petitions.active}</div>
                    <div className="stat-label">Activas</div>
                  </div>
                  <div className="stat-card stat-warning">
                    <div className="stat-value">{dashboardData.summary.petitions.pending_review}</div>
                    <div className="stat-label">Pendientes de revisión</div>
                  </div>
                </div>
              </div>

              {/* Postulaciones Recibidas */}
              <div className="dashboard-section">
                <h3 className="section-title">
                  <i className="bi bi-inbox me-2"></i>
                  Postulaciones Recibidas
                </h3>
                <div className="stats-grid">
                  <div className="stat-card stat-info">
                    <div className="stat-value">{dashboardData.summary.postulations.total_received}</div>
                    <div className="stat-label">Total Recibidas</div>
                  </div>
                </div>
              </div>

              {/* Calificaciones */}
              <div className="dashboard-section">
                <h3 className="section-title">
                  <i className="bi bi-star-fill me-2"></i>
                  Calificaciones
                </h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{dashboardData.summary.ratings.total_given}</div>
                    <div className="stat-label">Calificaciones Dadas</div>
                  </div>
                </div>
              </div>

              {/* Comunicaciones */}
              <div className="dashboard-section">
                <h3 className="section-title">
                  <i className="bi bi-chat-dots me-2"></i>
                  Comunicaciones
                </h3>
                <div className="stats-grid">
                  <div className="stat-card stat-warning">
                    <div className="stat-value">{dashboardData.summary.communications.unread_messages}</div>
                    <div className="stat-label">Mensajes no leídos</div>
                  </div>
                  <div className="stat-card stat-warning">
                    <div className="stat-value">{dashboardData.summary.communications.unread_notifications}</div>
                    <div className="stat-label">Notificaciones no leídas</div>
                  </div>
                </div>
              </div>

              {/* Peticiones Recientes */}
              {dashboardData.recent_petitions && dashboardData.recent_petitions.length > 0 && (
                <div className="dashboard-section">
                  <h3 className="section-title">
                    <i className="bi bi-clock-history me-2"></i>
                    Peticiones Recientes
                  </h3>
                  <div className="recent-list">
                    {dashboardData.recent_petitions.map((petition) => (
                      <div key={petition.id_petition} className="recent-item">
                        <div className="recent-item-header">
                        </div>
                        <div className="recent-item-description">{petition.description}</div>
                        <div className="recent-item-meta">
                          <span>Creada: {new Date(petition.date_create).toLocaleDateString('es-ES')}</span>
                          {petition.date_until && (
                            <span>Hasta: {new Date(petition.date_until).toLocaleDateString('es-ES')}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

