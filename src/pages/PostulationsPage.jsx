import React, { useState, useEffect, useCallback } from 'react';
import PostulationList from '../components/postulations/PostulationList';
import { getProviderPostulations } from '../services/postulation.service.js';

const PostulationsPage = () => {
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostulations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProviderPostulations();
      setPostulations(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las postulaciones.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPostulations();
  }, [fetchPostulations]);

  return (
    <div className="offers-page"> {/* Re-using offers-page class for similar layout */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mis Postulaciones</h1>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Postulaciones Realizadas</h5>
          {loading && <p>Cargando postulaciones...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && <PostulationList postulations={postulations} />} 
        </div>
      </div>
    </div>
  );
};

export default PostulationsPage;