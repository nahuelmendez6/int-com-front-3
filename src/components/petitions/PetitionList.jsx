// components/PetitionList.jsx
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { usePostulations } from "../../hooks/usePostulations.js";
import AttachmentsGallery from "../attachments/AttachmentsGallery.jsx";
import ImageModal from "../attachments/ImageModal.jsx";
import PostulationsList from "../postulations/PostulationList.jsx";

const PetitionList = ({ petitions, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { postulations, visiblePetition, loading, error, togglePostulations } = usePostulations();

  if (!petitions?.length)
    return <div className="alert alert-info">No tienes peticiones creadas en este momento.</div>;

  const handleOpenModal = (atts, idx) => {
    setAttachments(atts.filter((a) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(a.file)));
    setCurrentIndex(idx);
    setShowModal(true);
  };

  return (
    <>
      <div className="list-group">
        {petitions.map((petition) => (
          <div key={petition.id_petition} className="list-group-item mb-3">
            <div className="d-flex justify-content-between">
              <h5>{petition.description}</h5>
              <small>
                Estado: <span className={`badge bg-${petition.id_state === 1 ? "success" : "secondary"}`}>{petition.id_state}</span>
              </small>
            </div>
            <small className="text-muted">
              Desde: {petition.date_since || "No especificado"} hasta {petition.date_until || "No especificado"}
            </small>

            <AttachmentsGallery attachments={petition.attachments} onOpenModal={handleOpenModal} />

            <div className="mt-2">
              <Button size="sm" variant="outline-primary" className="me-2" onClick={() => onEdit(petition)}>Editar</Button>
              <Button size="sm" variant="outline-danger" className="me-2" onClick={() => onDelete(petition.id_petition)}>Eliminar</Button>
              <Link to={`/petitions/${petition.id_petition}/apply`}>
                <Button size="sm" variant="outline-success">Postularse</Button>
              </Link>
              <Button
                size="sm"
                variant="info"
                className="ms-2"
                onClick={() => togglePostulations(petition.id_petition)}
                disabled={loading && visiblePetition === petition.id_petition}
              >
                {loading && visiblePetition === petition.id_petition
                  ? "Cargando..."
                  : visiblePetition === petition.id_petition
                  ? "Ocultar Postulaciones"
                  : "Ver Postulaciones"}
              </Button>
            </div>

            {visiblePetition === petition.id_petition && (
              <PostulationsList postulations={postulations} loading={loading} error={error} />
            )}
          </div>
        ))}
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
