import React, { useState, useEffect } from 'react';
import contratacionesService from '../services/contrataciones.service.js';
import ContratacionList from '../components/contrataciones/ContratacionList.jsx';
import { Alert } from 'react-bootstrap';

const ContratacionesPage = () => {
  const [contrataciones, setContrataciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="contrataciones-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          <h1 className="card-title mb-4">
            <i className="bi bi-check2-square me-2"></i>
            Mis Contrataciones
          </h1>
          <p className="text-muted mb-4">
            Gestiona tus contrataciones activas y el historial de servicios contratados.
          </p>
          
          {error && (
            <Alert variant="danger" className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}
          {!error && <ContratacionList contrataciones={contrataciones} />}
        </div>
      </div>
    </div>
  );
};

export default ContratacionesPage;