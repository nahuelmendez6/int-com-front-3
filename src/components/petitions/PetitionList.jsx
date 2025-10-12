import React, { useState } from 'react';
import { Modal, Carousel, Button, Card, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getPostulationsByPetition } from '../../services/postulation.service';

const PetitionList = ({ petitions, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentAttachments, setCurrentAttachments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [postulations, setPostulations] = useState([]);
  const [loadingPostulations, setLoadingPostulations] = useState(false);
  const [errorPostulations, setErrorPostulations] = useState(null);
  const [visiblePostulations, setVisiblePostulations] = useState(null);

  const handleOpenModal = (attachments, clickedIndex) => {
    const images = attachments.filter(att => isImage(att.file));
    setCurrentAttachments(images);
    setCurrentIndex(clickedIndex);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const isImage = (file) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file);
  };

  const handleViewPostulations = async (petitionId) => {
    if (visiblePostulations === petitionId) {
      setVisiblePostulations(null);
      return;
    }

    setLoadingPostulations(true);
    setErrorPostulations(null);
    setPostulations([]);
    try {
      const data = await getPostulationsByPetition(petitionId);
      setPostulations(data);
      setVisiblePostulations(petitionId);
    } catch (error) {
      setErrorPostulations('No se pudieron cargar las postulaciones.');
    } finally {
      setLoadingPostulations(false);
    }
  };

  if (!petitions || petitions.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No tienes peticiones creadas en este momento.
      </div>
    );
  }

  return (
    <>
      <div className="list-group">
        {petitions.map((petition) => (
          <div
            key={petition.id_petition}
            className="list-group-item list-group-item-action flex-column align-items-start mb-3"
          >
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{petition.description}</h5>
              <small>
                Estado: <span className={`badge bg-${petition.id_state === 1 ? 'success' : 'secondary'}`}>{petition.id_state}</span>
              </small>
            </div>
            <small className="text-muted">
              Desde: {petition.date_since || 'No especificado'} hasta {petition.date_until || 'No especificado'}
            </small>

            {petition.attachments && petition.attachments.length > 0 && (
              <div className="attachments mt-3 d-flex flex-wrap">
                {petition.attachments.map((attachment, index) => (
                  <div key={index} className="me-2 mb-2 text-center" style={{ maxWidth: '150px', cursor: 'pointer' }} onClick={() => handleOpenModal(petition.attachments, index)}>
                    {isImage(attachment.file) ? (
                      <img src={`http://127.0.0.1:8000${attachment.file}`} alt={`Adjunto ${index + 1}`} className="img-fluid rounded shadow-sm" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center border rounded p-2" style={{ height: '150px', width: '150px' }}>
                        <i className="bi bi-file-earmark-text" style={{ fontSize: '2rem' }}></i>
                        <small className="text-truncate">{attachment.file.split('/').pop()}</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2">
              <Button size="sm" variant="outline-primary" className="me-2" onClick={() => onEdit(petition)}>Editar</Button>
              <Button size="sm" variant="outline-danger" className="me-2" onClick={() => onDelete(petition.id_petition)}>Eliminar</Button>
              <Link to={`/petitions/${petition.id_petition}/apply`}><Button size="sm" variant="outline-success">Postularse</Button></Link>
              <Button size="sm" variant="info" className="ms-2" onClick={() => handleViewPostulations(petition.id_petition)} disabled={loadingPostulations && visiblePostulations === petition.id_petition}>
                {loadingPostulations && visiblePostulations === petition.id_petition ? 'Cargando...' : (visiblePostulations === petition.id_petition ? 'Ocultar' : 'Ver') + ' Postulaciones'}
              </Button>
            </div>

            {visiblePostulations === petition.id_petition && (
              <div className="mt-3">
                {loadingPostulations && <p>Cargando postulaciones...</p>}
                {errorPostulations && <Alert variant="danger">{errorPostulations}</Alert>}
                {!loadingPostulations && postulations.length > 0 && (
                  <Card>
                    <Card.Header>Postulaciones</Card.Header>
                    <Card.Body>
                      {postulations.map(post => (
                        <div key={post.id_postulation} className="mb-4 border-bottom pb-3">
                          <div className="d-flex justify-content-between">
                            <h6>Propuesta del Proveedor #{post.id_provider}</h6>
                            <Badge pill bg={post.winner ? "success" : "secondary"}>{post.winner ? "Ganador" : "Pendiente"}</Badge>
                          </div>
                          <p>{post.proposal}</p>
                          {post.budgets && post.budgets.length > 0 && (
                            <div>
                              <strong>Presupuesto:</strong>
                              <ul>
                                {post.budgets.map(b => (
                                  <li key={b.id_budget}>{b.cost_type}: {b.amount || b.unit_price}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                           {post.materials && post.materials.length > 0 && (
                            <div>
                              <strong>Materiales:</strong>
                              <ul>
                                {post.materials.map(m => (
                                  <li key={m.id_postulation_material}>{m.id_material} - Cant: {m.quantity}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                )}
                {!loadingPostulations && !errorPostulations && postulations.length === 0 && (
                  <Alert variant="info">No hay postulaciones para esta petición.</Alert>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Body>
          {currentAttachments.length > 0 ? (
            <Carousel activeIndex={currentIndex} onSelect={(selectedIndex) => setCurrentIndex(selectedIndex)} interval={null}>
              {currentAttachments.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img className="d-block w-100" src={`http://127.0.0.1:8000${img.file}`} alt={`Adjunto ${idx + 1}`} />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : <p>No hay imágenes para mostrar.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PetitionList;
