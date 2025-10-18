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

  if (loading) return <p className="text-center mt-5">Cargando contrataciones...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mis Contrataciones</h1>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {!error && <ContratacionList contrataciones={contrataciones} />}
    </div>
  );
};

export default ContratacionesPage;