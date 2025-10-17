import React, { useState, useEffect } from 'react';
import PortfolioList from '../components/portfolio/PortfolioList';
import PortfolioForm from '../components/portfolio/PortfolioForm';
import portfolioService from '../services/portfolio.service';
import { Button, Modal } from 'react-bootstrap';

const PortfolioPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await portfolioService.getPortfolios();
      setPortfolios(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el portfolio.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSuccess = () => {
    fetchPortfolios();
    handleCloseModal();
  };

  if (loading) return <p>Cargando portfolio...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mi Portfolio</h1>
        <Button variant="primary" onClick={handleShowModal}>
          Crear Nuevo Proyecto
        </Button>
      </div>
      
      <PortfolioList portfolios={portfolios} refreshPortfolios={fetchPortfolios} />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Proyecto de Portfolio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PortfolioForm onSuccess={handleSuccess} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PortfolioPage;
