import React, { useState, useEffect } from 'react';
import { getPostulationStatistics } from '../../services/postulation.service.js';
import './PostulationStatistics.css';


/**
 * @function PostulationStatistics
 * @description Componente que muestra diversas métricas y estadísticas relacionadas
 * con las postulaciones (ofertas de servicio) de un proveedor.
 * Realiza una llamada API para obtener los datos al montarse y maneja los estados
 * de carga, error y visualización de datos.
 * @returns {JSX.Element} La interfaz de usuario que muestra las estadísticas agrupadas.
 */
const PostulationStatistics = () => {

  // 1. Estados Locales
  
  // Almacena el objeto de estadísticas retornado por la API.
  const [stats, setStats] = useState(null);

  // Indica si los datos están siendo cargados (muestra el spinner).
  const [loading, setLoading] = useState(true);

  // Almacena el mensaje de error en caso de fallo de la API.
  const [error, setError] = useState(null);

  // 2. Efecto de Carga de Datos (al montar el componente)
  useEffect(() => {

    /**
     * @async
     * @function fetchStatistics
     * @description Llama al servicio API para obtener las estadísticas de postulaciones.
     * Gestiona el ciclo de vida de carga (inicio, éxito o fallo).
     */
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        // Llamada al servicio API
        const data = await getPostulationStatistics();
        setStats(data);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        // Captura el mensaje de error desde la respuesta o un mensaje genérico.
        setError(err.response?.data?.detail || err.message || 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);
  // 3. Renderizado Condicional: Carga
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }
  // 4. Renderizado Condicional: Error
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </div>
    );
  }
  // Si no hay errores y 'stats' es nulo (aunque esto debería ser capturado en el loading/error), no renderiza nada.
  if (!stats) {
    return null;
  }

  return (
    <div className="postulation-statistics">
      <h2 className="statistics-title">
        <i className="bi bi-bar-chart-fill me-2"></i>
        Estadísticas de Postulaciones
      </h2>

      {/* Resumen General */}
      <div className="statistics-section">
        <h3 className="section-title">
          <i className="bi bi-info-circle me-2"></i>
          Resumen General
        </h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.summary.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card stat-success">
            <div className="stat-value">{stats.summary.approved}</div>
            <div className="stat-label">Aprobadas</div>
            <div className="stat-percentage">
              {stats.summary.percentages.approved.toFixed(1)}%
            </div>
          </div>
          <div className="stat-card stat-danger">
            <div className="stat-value">{stats.summary.rejected}</div>
            <div className="stat-label">Rechazadas</div>
            <div className="stat-percentage">
              {stats.summary.percentages.rejected.toFixed(1)}%
            </div>
          </div>
          <div className="stat-card stat-warning">
            <div className="stat-value">{stats.summary.pending}</div>
            <div className="stat-label">Pendientes</div>
            <div className="stat-percentage">
              {stats.summary.percentages.pending.toFixed(1)}%
            </div>
          </div>
          <div className="stat-card stat-primary">
            <div className="stat-value">{stats.summary.winners}</div>
            <div className="stat-label">Ganadoras</div>
            {stats.summary.total > 0 && (
              <div className="stat-percentage">
                {((stats.summary.winners / stats.summary.total) * 100).toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desglose por Estado */}
      {stats.by_state && stats.by_state.length > 0 && (
        <div className="statistics-section">
          <h3 className="section-title">
            <i className="bi bi-list-ul me-2"></i>
            Desglose por Estado
          </h3>
          <div className="state-list">
            {stats.by_state.map((state) => (
              <div key={state.state_id} className="state-item">
                <div className="state-name">{state.state_name}</div>
                <div className="state-count">{state.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Postulaciones Recientes */}
      {stats.recent_postulations && stats.recent_postulations.length > 0 && (
        <div className="statistics-section">
          <h3 className="section-title">
            <i className="bi bi-clock-history me-2"></i>
            Postulaciones Recientes
          </h3>
          <div className="recent-list">
            {stats.recent_postulations.map((post) => {
              const isWinner = post.winner === true;
              return (
                <div 
                  key={post.id_postulation} 
                  className={`recent-item ${isWinner ? 'recent-item-winner' : ''}`}
                >
                  <div className="recent-item-header">
                    <span className="recent-item-id">
                      Postulación #{post.id_postulation}
                      {isWinner && <i className="bi bi-trophy-fill ms-2 text-warning"></i>}
                    </span>
                    <div className="d-flex gap-2 align-items-center">
                      {isWinner ? (
                        <>
                          <span className="badge bg-warning text-dark">
                            <i className="bi bi-trophy-fill me-1"></i>
                            Ganadora
                          </span>
                          <span className="badge bg-success">
                            {post.id_state__name}
                          </span>
                        </>
                      ) : (
                        <span className={`badge ${getStateBadgeClass(post.id_state__name)}`}>
                          {post.id_state__name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="recent-item-meta">
                    <span>Petición #{post.id_petition}</span>
                    <span>{new Date(post.date_create).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * @function getStateBadgeClass
 * @description Función auxiliar para asignar una clase de badge de Bootstrap 
 * basada en el nombre del estado (ej: 'Aprobada' -> 'bg-success').
 * @param {string} stateName - El nombre del estado de la postulación.
 * @returns {string} La clase CSS del badge.
 */
const getStateBadgeClass = (stateName) => {
  const state = stateName?.toLowerCase();
  if (state?.includes('aprobada')) return 'bg-success';
  if (state?.includes('rechazada')) return 'bg-danger';
  if (state?.includes('pendiente')) return 'bg-warning';
  return 'bg-secondary';
};

export default PostulationStatistics;

