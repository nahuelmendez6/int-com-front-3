import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Row, Carousel, Modal } from 'react-bootstrap';
import portfolioService from '../../services/portfolio.service';


/**
 * @function PortfolioList
 * @description Componente que renderiza la lista de proyectos del portfolio de un proveedor
 * en formato de tarjetas. Soporta dos modos: vista pública (solo visualización) y
 * vista de edición (con opciones para archivar).
 * * @param {object[]} portfolios - Array de objetos de portfolio.
 * @param {function} refreshPortfolios - Callback para recargar la lista después de una acción (ej: archivar).
 * @param {boolean} isPublicView - Si es `true`, oculta los botones de acción y los enlaces de edición.
 * @returns {JSX.Element} La cuadrícula de tarjetas de portfolio o un mensaje/null si está vacío.
 */
const PortfolioList = ({ portfolios, refreshPortfolios, isPublicView = false }) => {

  // URL base para cargar archivos adjuntos de la API.
  const API_BASE_URL = 'http://127.0.0.1:8000';

  // 1. Estados Locales para el Modal de Confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [portfolioToArchive, setPortfolioToArchive] = useState(null);

  /**
   * @function openDeleteModal
   * @description Abre el modal de confirmación y establece el ID del proyecto a archivar.
   * @param {number} id - ID del proyecto de portfolio.
   */
  const openDeleteModal = (id) => {
    setPortfolioToArchive(id);
    setShowDeleteModal(true);
  };

  /**
   * @function closeDeleteModal
   * @description Cierra el modal de confirmación y limpia el ID del proyecto.
   */
  const closeDeleteModal = () => {
    setPortfolioToArchive(null);
    setShowDeleteModal(false);
  };

  /**
   * @async
   * @function handleSoftDelete
   * @description Realiza la eliminación lógica (soft delete/archivado) del proyecto seleccionado.
   */
  const handleSoftDelete = async () => {
    if (!portfolioToArchive) return;

    try {
      await portfolioService.softDeletePortfolio(portfolioToArchive);
      if(refreshPortfolios) refreshPortfolios();
    } catch (error) {
      console.error('Error al archivar el proyecto', error);
      alert('No se pudo archivar el proyecto.');
    } finally {
      closeDeleteModal();
    }
  };

  // Filtra los proyectos que no han sido eliminados lógicamente (is_deleted: false)
  const activePortfolios = portfolios.filter(p => !p.is_deleted);

  // 2. Renderizado Condicional: Lista Vacía
  if (!activePortfolios || activePortfolios.length === 0) {
    // No muestra nada en el perfil público si no hay portfolio
    return isPublicView ? null : <p>Aún no has añadido ningún proyecto a tu portfolio.</p>;
  }

  // 3. Renderizado Principal de la Lista
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
                  {!isPublicView && (
                    <Button variant="outline-danger" size="sm" onClick={() => openDeleteModal(portfolio.id_portfolio)} title="Archivar proyecto">
                      <i className="bi bi-archive-fill"></i>
                    </Button>
                  )}
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

                {!isPublicView && (
                  <Card.Footer className="bg-white border-top-0">
                    <Link to={`/portfolio/${portfolio.id_portfolio}`}>
                      <Button variant="info" size="sm">Ver Detalles y Adjuntos</Button>
                    </Link>
                  </Card.Footer>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>

      {!isPublicView && (
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
      )}
    </>
  );
};

export default PortfolioList;
