/**
 * Componente: OfferList
 * 
 * Descripción:
 * ---------------
 * Este componente muestra una lista de **ofertas** de proveedores.
 * Cada oferta incluye:
 * - Información del proveedor (nombre, avatar, profesión)
 * - Estado de la oferta (activa/inactiva)
 * - Descripción de la oferta
 * - Fechas de apertura y cierre
 * - Botón para enviar un mensaje al proveedor
 * 
 * Props:
 * -------
 * - `offers` (array): Lista de ofertas a mostrar. Cada objeto de oferta debe incluir:
 *      - `offer_id`
 *      - `name`
 *      - `description`
 *      - `status`
 *      - `date_open`
 *      - `date_close`
 *      - `id_provider`
 * 
 * Funcionalidades clave:
 * -----------------------
 * - Obtiene los perfiles de los proveedores asociados a las ofertas.
 * - Maneja loading de perfiles con placeholders mientras se cargan.
 * - Permite iniciar conversación con el proveedor mediante el contexto `useMessageContext`.
 * - Muestra un mensaje central si no hay ofertas disponibles.
 * - Renderiza las fechas en formato local y muestra el estado con badges.
 * 
 * Estilos y librerías:
 * ----------------------
 * - React Router: `Link` para navegar al perfil del proveedor
 * - React-Bootstrap: Clases de Bootstrap para filas, columnas, badges y botones
 * - Iconos de Bootstrap Icons
 * - Clases personalizadas: `social-card`, `offer-card`, `badge-social`
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProviderProfileById } from '../../services/profile.service';
import { useMessageContext } from '../../contexts/MessageContext';
import { useAuth } from '../../hooks/useAuth';
import ConfirmationModal from '../common/ConfirmationModal';

const OfferList = ({ offers, onEdit, onDelete }) => {
  const [providerProfiles, setProviderProfiles] = useState({});
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const { createConversation } = useMessageContext();
  const { profile } = useAuth();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

  const handleDeleteClick = (offerId) => {
    setOfferToDelete(offerId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (offerToDelete) {
      onDelete(offerToDelete);
    }
    setShowConfirmModal(false);
    setOfferToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setOfferToDelete(null);
  };

  // --- Efecto: cargar perfiles de proveedores ---
  useEffect(() => {
    const fetchProviderProfiles = async () => {
      if (!offers || offers.length === 0) {
        setLoadingProfiles(false);
        return;
      }

      try {
        setLoadingProfiles(true);
        const uniqueProviderIds = [...new Set(offers.map(offer => offer.id_provider))];
        
        const profilePromises = uniqueProviderIds.map(async (providerId) => {
          try {
            const profileData = await getProviderProfileById(providerId);
            return { providerId, profile: profileData };
          } catch (error) {
            console.error(`Error fetching profile for provider ${providerId}:`, error);
            return { providerId, profile: null };
          }
        });

        const profiles = await Promise.all(profilePromises);
        const profilesMap = {};
        profiles.forEach(({ providerId, profile: profileData }) => {
          profilesMap[providerId] = profileData;
        });

        setProviderProfiles(profilesMap);
      } catch (error) {
        console.error('Error fetching provider profiles:', error);
      } finally {
        setLoadingProfiles(false);
      }
    };

    fetchProviderProfiles();
  }, [offers]);

  if (offers.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-3">
          <i className="bi bi-gift" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
        </div>
        <h5 className="text-muted">No hay ofertas disponibles</h5>
        <p className="text-muted">Vuelve más tarde para ver nuevas ofertas</p>
      </div>
    );
  }

  return (
    <>
      <div className="row g-3">
        {offers.map((offer, index) => {
          const providerProfile = providerProfiles[offer.id_provider];
          const isOwner = profile.profile?.id_provider === offer.id_provider;

          return (
            <div key={offer.offer_id} className="col-12">
              <div className="social-card offer-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-body p-4">
                  {/* Provider Info Header */}
                  <div className="d-flex align-items-center mb-3">
                    <Link 
                      to={`/provider/${offer.id_provider}`}
                      className="text-decoration-none d-flex align-items-center"
                    >
                      <div className="provider-avatar me-3">
                        {providerProfile?.user?.profile_image ? (
                          <img 
                            src={`http://127.0.0.1:8000${providerProfile.user.profile_image}`} 
                            alt={`${providerProfile.user.name} ${providerProfile.user.lastname}`}
                            className="rounded-circle"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                            style={{ width: '50px', height: '50px' }}
                          >
                            <i className="bi bi-person-fill" style={{ fontSize: '1.5rem' }}></i>
                          </div>
                        )}
                      </div>
                      <div>
                        <h6 className="mb-0 text-dark">
                          {loadingProfiles ? (
                            <span className="placeholder-glow">
                              <span className="placeholder col-6"></span>
                            </span>
                          ) : (
                            `${providerProfile?.user?.name || ''} ${providerProfile?.user?.lastname || ''}`.trim() || 'Proveedor'
                          )}
                        </h6>
                        <small className="text-muted">
                          {loadingProfiles ? (
                            <span className="placeholder-glow">
                              <span className="placeholder col-4"></span>
                            </span>
                          ) : (
                            providerProfile?.profession || 'Servicio'
                          )}
                        </small>
                      </div>
                    </Link>
                    
                    {isOwner && onEdit && onDelete ? (
                      <div className="ms-auto d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => onEdit(offer)}
                        >
                          <i className="bi bi-pencil-square me-1"></i>
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteClick(offer.offer_id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary ms-auto"
                        onClick={async () => {
                          const targetUserId = providerProfile?.user?.id_user || providerProfile?.user?.id;
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
                      </button>
                    )}
                  </div>

                  {/* Offer Info */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <div className="offer-icon me-3">
                        <i className="bi bi-tag-fill text-primary" style={{ fontSize: '1.5rem' }}></i>
                      </div>
                      <div>
                        <h5 className="mb-1 fw-bold text-dark">{offer.name}</h5>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`badge badge-social ${offer.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                            <i className={`bi ${offer.status === 'active' ? 'bi-check-circle' : 'bi-pause-circle'} me-1`}></i>
                            {offer.status === 'active' ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  <p className="text-muted mb-3">{offer.description}</p>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted small">
                      <i className="bi bi-calendar-event me-1"></i>
                      <span>Desde: {new Date(offer.date_open).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    </div>
                    <div className="text-muted small">
                      <i className="bi bi-calendar-x me-1"></i>
                      <span>Hasta: {new Date(offer.date_close).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ConfirmationModal
        show={showConfirmModal}
        onHide={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        body="¿Estás seguro de que quieres eliminar esta oferta? Esta acción no se puede deshacer."
      />
    </>
  );
};

export default OfferList;
