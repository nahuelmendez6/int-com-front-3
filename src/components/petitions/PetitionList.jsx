import React, { useState } from 'react';
import { Modal, Carousel, Button } from 'react-bootstrap';

const PetitionList = ({ petitions, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentAttachments, setCurrentAttachments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFiles, setCurrentFiles] = useState([]); // para manejar archivos no-imagen si es necesario

  const handleOpenModal = (attachments, clickedIndex) => {
    // Filtrar imágenes
    const images = attachments.filter(att => isImage(att.file));
    const files = attachments.filter(att => !isImage(att.file));

    setCurrentAttachments(images);  // solo imágenes para el carrusel
    setCurrentIndex(images.findIndex((img, idx) => idx === clickedIndex) >= 0 ? clickedIndex : 0);
    setShowModal(true);

    // Si querés, podés manejar los archivos aparte
    setCurrentFiles(files); // crear otro state si querés mostrarlos en modal
  };


  const handleCloseModal = () => setShowModal(false);

  // Función para detectar si un archivo es imagen
  const isImage = (file) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file);
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
                Estado:{' '}
                <span
                  className={`badge bg-${petition.id_state === 1 ? 'success' : 'secondary'}`}
                >
                  {petition.id_state}
                </span>
              </small>
            </div>
            <small className="text-muted">
              Desde: {petition.date_since || 'No especificado'} hasta {petition.date_until || 'No especificado'}
            </small>

            {/* Adjuntos */}
            {petition.attachments && petition.attachments.length > 0 && (
              <div className="attachments mt-3 d-flex flex-wrap">
                {petition.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="me-2 mb-2 text-center"
                    style={{ maxWidth: '150px', cursor: 'pointer' }}
                  >
                    {isImage(attachment.file) ? (
                      <img
                        src={`http://127.0.0.1:8000${attachment.file}`}
                        alt={`Adjunto ${index + 1}`}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: '150px', objectFit: 'cover' }}
                        onClick={() => handleOpenModal(petition.attachments, index)}
                      />
                    ) : (
                      <div
                        className="d-flex flex-column align-items-center justify-content-center border rounded p-2"
                        style={{ height: '150px', width: '150px' }}
                        onClick={() => handleOpenModal(petition.attachments, index)}
                      >
                        <i className="bi bi-file-earmark-text" style={{ fontSize: '2rem' }}></i>
                        <small className="text-truncate">{attachment.file.split('/').pop()}</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2">
              <Button
                size="sm"
                variant="outline-primary"
                className="me-2"
                onClick={() => onEdit(petition)}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => onDelete(petition.id_petition)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Body>
          {currentAttachments.length === 0 ? (
            <p>No hay imágenes para mostrar.</p>
          ) : (
            <Carousel
              activeIndex={currentIndex}
              onSelect={(selectedIndex) => setCurrentIndex(selectedIndex)}
              interval={null}
            >
              {currentAttachments.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    className="d-block w-100"
                    src={`http://127.0.0.1:8000${img.file}`}
                    alt={`Adjunto ${idx + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>



    </>
  );
};

export default PetitionList;
