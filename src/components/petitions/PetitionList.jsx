import React, { useState, useEffect } from "react";
import { Button, Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { usePostulations } from "../../hooks/usePostulations.js";
import { getProviderPostulations } from "../../services/postulation.service.js"; // Import the service
import AttachmentsGallery from "../attachments/AttachmentsGallery.jsx";
import ImageModal from "../attachments/ImageModal.jsx";
import PostulationsList from "../postulations/PostulationList.jsx";
import { useAuth } from "../../hooks/useAuth.js"; // Add this import
import { useMessageContext } from "../../contexts/MessageContext";
import "./PetitionList.css";


/**
 * @function PetitionList
 * @description Componente principal que muestra una lista de peticiones (solicitudes de servicio).
 * El comportamiento de la lista es dinámico y depende del rol del usuario (`profile`):
 * - Cliente: Muestra botones de Edición/Eliminación y la lista de Postulaciones recibidas.
 * - Proveedor: Muestra botones de Postularse/Mensaje y el estado de postulación actual.
 * * Utiliza el hook `usePostulations` para gestionar la carga y actualización de postulaciones.
 * * * @param {object[]} petitions - Array de objetos de petición a mostrar.
 * @param {function} onEdit - Callback para editar una petición (modo Cliente).
 * @param {function} onDelete - Callback para eliminar una petición (modo Cliente).
 * @param {object} profile - Objeto de perfil del usuario logueado (incluye el `role`).
 * @returns {JSX.Element} La lista de tarjetas de petición.
 */
const PetitionList = ({ petitions, onEdit, onDelete, profile }) => {
  const [showModal, setShowModal] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [providerPostulations, setProviderPostulations] = useState([]); // New state for provider's postulations
  const [loadingProviderPostulations, setLoadingProviderPostulations] = useState(true); // New state for loading
  
  const { user } = useAuth(); // Get user from useAuth()
  const { createConversation } = useMessageContext();

  const {
    postulations,
    visiblePetition,
    loading,
    error,
    togglePostulations,
    handleUpdatePostulation,
  } = usePostulations();

  useEffect(() => {
    const fetchProviderPostulations = async () => {
      if (profile?.role === "provider" && user?.id) { // Use user.id instead of profile.id_user
        setLoadingProviderPostulations(true);
        try {
          const data = await getProviderPostulations();
          console.log('postulaciones',data)
          setProviderPostulations(data);
        } catch (err) {
          console.error("Error fetching provider postulations:", err);
        } finally {
          setLoadingProviderPostulations(false);
        }
      } else {
        setProviderPostulations([]);
        setLoadingProviderPostulations(false);
      }
    };

    fetchProviderPostulations();
  }, [profile, user]); // Re-fetch when profile or user changes

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
        {petitions.map((petition, index) => {
          console.log('petition',petition)
          const isVisible = visiblePetition === petition.id_petition;
          const hasPostulated = providerPostulations.some(
            (p) => p.id_petition === petition.id_petition && !p.is_deleted
          );

          return (
            <Card
              key={petition.id_petition}
              className="petition-card social-card mb-4"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Encabezado */}
              {petition.customer_user && (
                <div className="card-header d-flex align-items-center gap-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                  <Link 
                    to={`/customer/${petition.id_customer}`}
                    className="text-decoration-none"
                    style={{ color: 'inherit' }}
                  >
                    <Image
                      src={`http://localhost:8000${petition.customer_user.profile_image}`}
                      roundedCircle
                      className="profile-image"
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        objectFit: 'cover',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  </Link>
                  <div>
                    <Link 
                      to={`/customer/${petition.id_customer}`}
                      className="text-decoration-none"
                      style={{ color: 'inherit' }}
                    >
                      <h6 className="mb-0 fw-semibold" style={{ cursor: 'pointer' }}>
                        <i className="bi bi-person-circle me-2"></i>
                        {petition.customer_user.name}{" "}
                        {petition.customer_user.lastname}
                      </h6>
                    </Link>
                    <small className="opacity-75">
                      <i className="bi bi-envelope me-1"></i>
                      {petition.customer_user.email}
                    </small>
                  </div>
                </div>
              )}

              {/* Cuerpo */}
              <Card.Body className="p-4">
                <div className="border-start border-3 border-primary ps-3 mb-3">
                  <p className="fs-5 mb-0 text-dark">{petition.description}</p>
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

              {/* Pie de acciones */}
              <div className="border-top d-flex flex-wrap justify-content-between align-items-center px-4 py-3" style={{ background: 'rgba(248, 249, 250, 0.8)' }}>
                <small className="text-muted d-flex align-items-center">
                  <i className="bi bi-calendar-range me-2"></i>
                  <span>Desde: {new Date(petition.date_since).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                  <span className="mx-2">•</span>
                  <span>Hasta: {new Date(petition.date_until).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                </small>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {profile?.role === "customer" && (
                    <>
                      <Button
                        variant="link"
                        className="text-secondary p-2 rounded-circle"
                        onClick={() => onEdit(petition)}
                        style={{ transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        <i className="bi bi-pencil-square fs-5"></i>
                      </Button>
                      <Button
                        variant="link"
                        className="text-danger p-2 rounded-circle"
                        onClick={() => onDelete(petition.id_petition)}
                        style={{ transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        <i className="bi bi-trash fs-5"></i>
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="btn-social btn-primary-social"
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
                    hasPostulated ? (
                      <Button
                        variant="success"
                        size="sm"
                        className="btn-social btn-success-social d-flex align-items-center"
                        disabled={true}
                      >
                        <i className="bi bi-send-check me-1"></i>
                        Ya Postulado
                      </Button>
                    ) : (
                      <Link
                        to={`/petitions/${petition.id_petition}/apply`}
                        className="text-decoration-none"
                      >
                        <Button
                          variant="success"
                          size="sm"
                          className="btn-social btn-success-social d-flex align-items-center"
                          disabled={loadingProviderPostulations}
                        >
                          <i className="bi bi-send-check me-1"></i>
                          Postularse
                        </Button>
                      </Link>
                    )
                  )}

                  {profile?.role === "provider" && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="btn-social d-flex align-items-center"
                      onClick={async () => {
                        const targetUserId = petition?.customer_user?.id_user || petition?.customer_user?.id;
                        if (!targetUserId) return;
                        try {
                          const conv = await createConversation(targetUserId);
                          const conversationId = conv?.id || conv?.id_conversation || conv?.conversation_id;
                          if (!conversationId) return;
                          window.dispatchEvent(new CustomEvent('openMessages', { detail: { conversationId } }));
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                    >
                      <i className="bi bi-chat-dots me-1"></i>
                      Mensaje
                    </Button>
                  )}
                </div>
              </div>

              {/* Postulaciones */}
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

      <ImageModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        images={attachments}
        currentIndex={currentIndex}
      />

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
