import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import portfolioService from '../services/portfolio.service';
import AttachmentManager from '../components/portfolio/AttachmentManager';

const PortfolioDetailPage = () => {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolioDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await portfolioService.getPortfolioById(id);
      setPortfolio(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los detalles del proyecto.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPortfolioDetails();
  }, [fetchPortfolioDetails]);

  if (loading) return <p>Cargando detalles del proyecto...</p>;
  if (error) return <p>{error}</p>;
  if (!portfolio) return <p>Proyecto no encontrado.</p>;

  return (
    <div className="container mt-4">
      <h2>{portfolio.name}</h2>
      <p>{portfolio.description}</p>
      <hr />
      <AttachmentManager 
        portfolioId={portfolio.id_portfolio} 
        attachments={portfolio.attachments || []}
        refreshDetails={fetchPortfolioDetails}
      />
    </div>
  );
};

export default PortfolioDetailPage;
