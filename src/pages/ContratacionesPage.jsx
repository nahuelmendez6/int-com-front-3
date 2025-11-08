import React, { useState, useEffect } from 'react';
import contratacionesService from '../services/contrataciones.service.js';
import ContratacionList from '../components/contrataciones/ContratacionList.jsx';
import PostulationStatistics from '../components/postulations/PostulationStatistics.jsx';
import { Alert, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth.js';

const ContratacionesPage = () => {
  const { profile } = useAuth();
  const [contrataciones, setContrataciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('contrataciones');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await contratacionesService.getContrataciones();
        setContrataciones(response.data);
      } catch (error) {
        console.error("Error al cargar las contrataciones", error);
        setError('No se pudieron cargar las contrataciones. Es posible que la funcionalidad del backend aún no esté implementada. Consulta el archivo backend_contrataciones.md.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="contrataciones-page">
        <div className="card shadow rounded-3">
          <div className="card-body p-4">
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando contrataciones...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isProvider = profile?.role === 'provider';

  return (
    <div className="contrataciones-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          <h1 className="card-title mb-4">
            <i className="bi bi-check2-square me-2"></i>
            {isProvider ? 'Trabajos Aprobados' : 'Mis Contrataciones'}
          </h1>
          <p className="text-muted mb-4">
            {isProvider 
              ? 'Gestiona tus trabajos aprobados y visualiza estadísticas de tus postulaciones.'
              : 'Gestiona tus contrataciones activas y el historial de servicios contratados.'}
          </p>
          
          {error && (
            <Alert variant="danger" className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}

          {isProvider ? (
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              <Tab eventKey="contrataciones" title={
                <span>
                  <i className="bi bi-check2-square me-2"></i>
                  Trabajos Aprobados
                </span>
              }>
                {!error && <ContratacionList contrataciones={contrataciones} />}
              </Tab>
              <Tab eventKey="estadisticas" title={
                <span>
                  <i className="bi bi-bar-chart-fill me-2"></i>
                  Estadísticas
                </span>
              }>
                <div className="mt-4">
                  <PostulationStatistics />
                </div>
              </Tab>
            </Tabs>
          ) : (
            !error && <ContratacionList contrataciones={contrataciones} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContratacionesPage;