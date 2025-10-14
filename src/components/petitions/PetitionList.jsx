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
      <div className="feed-container">
        {petitions.map((petition) => {
          const isVisible = visiblePetition === petition.id_petition;

          return (
            <Card
              key={petition.id_petition}
              className="mb-4 shadow-sm border rounded-4 overflow-hidden bg-white"
            >
              {/* 🟦 Encabezado: Usuario */}
              {petition.customer_user && (
                <div className="d-flex align-items-center p-3 border-bottom bg-light">
                  <Image
                    src={`http://localhost:8000${petition.customer_user.profile_image}`}
                    roundedCircle
                    style={{
                      width: "55px",
                      height: "55px",
                      objectFit: "cover",
                      border: "2px solid #e9ecef",
                    }}
                  />
                  <div className="ms-3">
                    <h6 className="mb-0 fw-semibold">
                      {petition.customer_user.name} {petition.customer_user.lastname}
                    </h6>
                    <small className="text-muted">{petition.customer_user.email}</small>
                  </div>
                </div>
              )}

              {/* 🟩 Contenido */}
              <Card.Body className="p-4">
                <div className="border-start border-3 border-primary ps-3 mb-3">
                  <p className="fs-5 mb-0" style={{ whiteSpace: "pre-line" }}>
                    {petition.description}
                  </p>
                </div>

                {/* Galería */}
                {petition.attachments && petition.attachments.length > 0 && (
                  <div className="post-image-gallery mb-3">
                    <AttachmentsGallery
                      attachments={petition.attachments}
                      onOpenModal={handleOpenModal}
                      style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        maxHeight: "500px",
                      }}
                    />
                  </div>
                )}
              </Card.Body>

              {/* 🟥 Acciones y fecha */}
              <div className="border-top d-flex justify-content-between align-items-center px-4 py-3 bg-light">
                <small className="text-muted">
                  <i className="bi bi-calendar-range me-2"></i>
                  Publicado: {new Date(petition.date_since).toLocaleDateString()} -{" "}
                  {new Date(petition.date_until).toLocaleDateString()}
                </small>

                <div className="d-flex align-items-center gap-2">
                  {/* Cliente */}
                  {profile?.role === "customer" && (
                    <>
                      <Button
                        variant="link"
                        className="text-secondary p-1"
                        onClick={() => onEdit(petition)}
                      >
                        <i className="bi bi-pencil-square fs-5"></i>
                      </Button>
                      <Button
                        variant="link"
                        className="text-danger p-1"
                        onClick={() => onDelete(petition.id_petition)}
                      >
                        <i className="bi bi-trash fs-5"></i>
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => togglePostulations(petition.id_petition)}
                        disabled={loading && isVisible}
                      >
                        <i className="bi bi-eye me-1"></i>
                        {loading && isVisible
                          ? "Cargando..."
                          : isVisible
                          ? "Ocultar Postulaciones"
                          : "Ver Postulaciones"}
                      </Button>
                    </>
                  )}

                  {/* Proveedor */}
                  {profile?.role === "provider" && (
                    <Link
                      to={`/petitions/${petition.id_petition}/apply`}
                      className="text-decoration-none"
                    >
                      <Button
                        variant="success"
                        size="sm"
                        className="d-flex align-items-center"
                      >
                        <i className="bi bi-send-check me-1"></i>
                        Postularse
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* 🟨 Sección Postulaciones */}
              {isVisible && (
                <div className="px-4 py-3 border-top bg-white">
                  <h6 className="fw-semibold mb-3">Postulaciones recibidas</h6>
                  <PostulationsList
                    postulations={postulations}
                    loading={loading}
                    error={error}
                    onUpdate={handleUpdatePostulation}
                    petitionId={petition.id_petition}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Modal de imágenes */}
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