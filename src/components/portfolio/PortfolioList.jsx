import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Row, Carousel, Modal } from 'react-bootstrap';
import portfolioService from '../../services/portfolio.service';

const PortfolioList = ({ portfolios, refreshPortfolios }) => {
  const API_BASE_URL = 'http://127.0.0.1:8000';

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [portfolioToArchive, setPortfolioToArchive] = useState(null);

  const openDeleteModal = (id) => {
    setPortfolioToArchive(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setPortfolioToArchive(null);
    setShowDeleteModal(false);
  };

  const handleSoftDelete = async () => {
    if (!portfolioToArchive) return;

    try {
      await portfolioService.softDeletePortfolio(portfolioToArchive);
      refreshPortfolios();
    } catch (error) {
      console.error('Error al archivar el proyecto', error);
      alert('No se pudo archivar el proyecto.');
    } finally {
      closeDeleteModal();
    }
  };

  const activePortfolios = portfolios.filter(p => !p.is_deleted);

  if (!activePortfolios || activePortfolios.length === 0) {
    return <p>Aún no has añadido ningún proyecto a tu portfolio.</p>;
  }

  return (
    <>
      <Row xs={1} md={1} className="g-4">
        {activePortfolios.map((portfolio) => {
          const imageAttachments = portfolio.attachments.filter(att => 
            att.file.match(/\.(jpeg|jpg|gif|png)$/) || att.file_type === 'image'
          );

          return (
            <Col key={portfolio.id_portfolio}>
              <Card className="mb-4 shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h2 className="h5 mb-0">{portfolio.name}</h2>
                  <Button variant="outline-danger" size="sm" onClick={() => openDeleteModal(portfolio.id_portfolio)} title="Archivar proyecto">
                    <i className="bi bi-archive-fill"></i>
                  </Button>
                </Card.Header>

                {imageAttachments.length > 0 && (
                  <Carousel interval={null}>
                    {imageAttachments.map(att => (
                      <Carousel.Item key={att.id_attachment}>
                        <img
                          className="d-block w-100"
                          src={`${API_BASE_URL}${att.file}`}
                          alt={`Adjunto del portfolio ${portfolio.name}`}
                          style={{ maxHeight: '400px', objectFit: 'contain', backgroundColor: '#f5f5f5' }}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}

                <Card.Body>
                  <Card.Text>{portfolio.description}</Card.Text>
                </Card.Body>

                <Card.Footer className="bg-white border-top-0">
                  <Link to={`/portfolio/${portfolio.id_portfolio}`}>
                    <Button variant="info" size="sm">Ver Detalles y Adjuntos</Button>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Modal de Confirmación para Archivar */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Acción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres archivar este proyecto? Podrás recuperarlo más tarde.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleSoftDelete}>
            Sí, Archivar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PortfolioList;