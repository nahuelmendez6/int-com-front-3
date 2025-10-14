import React, { useState } from "react";
import { Button, Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { usePostulations } from "../../hooks/usePostulations.js";
import AttachmentsGallery from "../attachments/AttachmentsGallery.jsx";
import ImageModal from "../attachments/ImageModal.jsx";
import PostulationsList from "../postulations/PostulationList.jsx";
import "./PetitionList.css";

const PetitionList = ({ petitions, onEdit, onDelete, profile }) => {
  const [showModal, setShowModal] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    postulations,
    visiblePetition,
    loading,
    error,
    togglePostulations,
    handleUpdatePostulation,
  } = usePostulations();

  if (!petitions?.length) {
    return (
      <div className="alert alert-info text-center mt-4">
        No hay peticiones disponibles en este momento.
      </div>
    );
  }

  const handleOpenModal = (atts, idx) => {
    const images = atts.filter((a) =>
      /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(a.file)
    );
    setAttachments(images);
    setCurrentIndex(idx);
    setShowModal(true);
  };

  return (
    <>
      <div className="petition-list-container">
        {petitions.map((petition) => {
          const isVisible = visiblePetition === petition.id_petition;

          return (
            <Card
              key={petition.id_petition}
              className="petition-card shadow-sm border rounded-4 overflow-hidden bg-white"
            >
              {/* 🟦 Encabezado */}
              {petition.customer_user && (
                <div className="card-header d-flex align-items-center gap-3 bg-white">
                  <Image
                    src={`http://localhost:8000${petition.customer_user.profile_image}`}
                    roundedCircle
                    className="profile-image"
                  />
                  <div>
                    <h6 className="mb-0 fw-semibold">
                      {petition.customer_user.name}{" "}
                      {petition.customer_user.lastname}
                    </h6>
                    <small className="text-muted">
                      {petition.customer_user.email}
                    </small>
                  </div>
                </div>
              )}

              {/* 🟩 Cuerpo */}
              <Card.Body className="p-4">
                <div className="border-start border-3 border-primary ps-3 mb-3">
                  <p className="fs-5 mb-0">{petition.description}</p>
                </div>

                {/* Galería */}
                {petition.attachments?.length > 0 && (
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

              {/* 🟥 Pie de acciones */}
              <div className="border-top d-flex flex-wrap justify-content-between align-items-center px-4 py-3 bg-light">
                <small className="text-muted">
                  <i className="bi bi-calendar-range me-2"></i>
                  {new Date(petition.date_since).toLocaleDateString()} -{" "}
                  {new Date(petition.date_until).toLocaleDateString()}
                </small>

                <div className="d-flex align-items-center gap-2 flex-wrap">
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

              {/* 🟨 Postulaciones */}
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

      <style>{`
  /* Sidebar fijo en escritorio */
  @media (min-width: 768px) {
    .sidebar-container {
      width: 250px; /* Ajustá según el ancho real del Sidebar */
      flex-shrink: 0;
    }

    main {
      margin-left: 250px; /* Debe coincidir con el ancho del sidebar */
      width: calc(100% - 250px);
    }
  }

  /* En móviles, que ocupe todo */
  @media (max-width: 767.98px) {
    main {
      margin-left: 0 !important;
      width: 100%;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
`}</style>


    </>
  );
};

export default PetitionList;
