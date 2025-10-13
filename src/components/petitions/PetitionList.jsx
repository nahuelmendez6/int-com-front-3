import React, { useState } from "react";
import { Button, Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import { usePostulations } from "../../hooks/usePostulations.js";
import AttachmentsGallery from "../attachments/AttachmentsGallery.jsx";
import ImageModal from "../attachments/ImageModal.jsx";
import PostulationsList from "../postulations/PostulationList.jsx";

const PetitionList = ({ petitions, onEdit, onDelete, profile }) => {
  const [showModal, setShowModal] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { postulations, visiblePetition, loading, error, togglePostulations, handleUpdatePostulation } = usePostulations();

  if (!petitions?.length) {
    return (
      <div className="alert alert-info">
        No hay peticiones disponibles en este momento.
      </div>
    );
  }

  const handleOpenModal = (atts, idx) => {
    const images = atts.filter((a) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(a.file));
    setAttachments(images);
    setCurrentIndex(idx);
    setShowModal(true);
  };

  return (
    <>
      <div>
        {petitions.map((petition) => {
          const isVisible = visiblePetition === petition.id_petition;

          return (
            <Card key={petition.id_petition} className="mb-3 shadow-sm">
              <Card.Body>
                {petition.customer_user && (
                  <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <Image src={`http://localhost:8000${petition.customer_user.profile_image}`} roundedCircle style={{ width: '45px', height: '45px', objectFit: 'cover' }} />
                    <div className="ms-3">
                      <h6 className="mb-0">{petition.customer_user.name} {petition.customer_user.lastname}</h6>
                      <small className="text-muted">{petition.customer_user.email}</small>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-md-8">
                    <h4 className="card-title border-start border-4 border-primary ps-3 mb-3">{petition.description}</h4>
                    <p className="text-muted small">
                      <i className="bi bi-calendar-range me-2"></i>
                      Publicado desde {new Date(petition.date_since).toLocaleDateString()} hasta {new Date(petition.date_until).toLocaleDateString()}
                    </p>
                    
                    <div className="mt-3" style={{ maxWidth: '400px' }}>
                      <AttachmentsGallery attachments={petition.attachments} onOpenModal={handleOpenModal} />
                    </div>
                  </div>

                  <div className="col-md-4 d-flex flex-column align-items-end">
                    {profile && profile.role === 'customer' && (
                      <div className="mb-auto">
                        <Button variant="link" className="text-secondary p-1" onClick={() => onEdit(petition)}>
                          <i className="bi bi-pencil-square fs-5"></i>
                        </Button>
                        <Button variant="link" className="text-danger p-1" onClick={() => onDelete(petition.id_petition)}>
                          <i className="bi bi-trash fs-5"></i>
                        </Button>
                      </div>
                    )}

                    {profile && profile.role === 'provider' && (
                      <Link to={`/petitions/${petition.id_petition}/apply`} className="w-100 mb-2">
                        <Button variant="success" className="w-100">
                          <i className="bi bi-send-check me-2"></i>
                          Postularse
                        </Button>
                      </Link>
                    )}
                    
                    {profile && profile.role === 'customer' && (
                        <Button
                          variant="info"
                          className="w-100"
                          onClick={() => togglePostulations(petition.id_petition)}
                          disabled={loading && isVisible}
                        >
                          <i className="bi bi-eye me-2"></i>
                          {loading && isVisible ? "Cargando..." : isVisible ? "Ocultar Postulaciones" : "Ver Postulaciones"}
                        </Button>
                    )}
                  </div>
                </div>

                {isVisible && (
                  <div className="mt-3 border-top pt-3">
                    <h5 className="mb-3">Postulaciones Recibidas</h5>
                    <PostulationsList 
                      postulations={postulations} 
                      loading={loading} 
                      error={error} 
                      onUpdate={handleUpdatePostulation}
                      petitionId={petition.id_petition}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </div>

      <ImageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        images={attachments}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </>
  );
};

export default PetitionList;