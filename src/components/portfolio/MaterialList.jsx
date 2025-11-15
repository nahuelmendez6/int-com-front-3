import React, { useState } from 'react';
import { Table, Button, Modal, Badge, Row, Col } from 'react-bootstrap';
import materialService from '../../services/material.service';
import MaterialForm from './MaterialForm';
import MaterialAttachmentManager from './MaterialAttachmentManager';


/**
 * @function MaterialList
 * @description Componente que muestra una lista de materiales (productos) de un proveedor en formato de tabla.
 * Soporta dos modos: vista pública (solo tabla) y vista de gestión (con edición, eliminación y adjuntos).
 * Incluye la lógica para mostrar modales de confirmación y formularios de edición/adjuntos.
 * * @param {object[]} materials - Array de objetos de material.
 * @param {boolean} isPublicView - Si es `true`, oculta las columnas de acciones.
 * @param {function} onEdit - [No usado internamente, pero pasado] Callback para editar.
 * @param {function} onDelete - [No usado internamente, pero pasado] Callback para eliminar.
 * @param {number} providerId - ID del proveedor actual.
 * @param {function} refreshMaterials - Callback para recargar la lista de materiales después de una acción.
 * @returns {JSX.Element} Una tabla con la lista de materiales y los modales asociados.
 */
const MaterialList = ({ materials, isPublicView = false, onEdit, onDelete, providerId, refreshMaterials }) => {
  
  // 1. Estados para la gestión de Modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // 2. Handlers de Apertura de Modales
  const openDeleteModal = (material) => {
    setSelectedMaterial(material);
    setShowDeleteModal(true);
  };

  const openEditModal = (material) => {
    setSelectedMaterial(material);
    setShowEditModal(true);
  };

  const openAttachmentsModal = (material) => {
    setSelectedMaterial(material);
    setShowAttachmentsModal(true);
  };


  /**
   * @function closeModals
   * @description Cierra todos los modales y limpia el material seleccionado.
   */
  const closeModals = () => {
    setShowDeleteModal(false);
    setShowEditModal(false);
    setShowAttachmentsModal(false);
    setSelectedMaterial(null);
  };

  // 3. Lógica de Eliminación
  /**
   * @async
   * @function handleDelete
   * @description Llama al servicio para eliminar el material seleccionado.
   */
  const handleDelete = async () => {
    if (!selectedMaterial) return;

    try {
      await materialService.deleteMaterial(selectedMaterial.id_material);
      if (refreshMaterials) refreshMaterials();
    } catch (error) {
      console.error('Error al eliminar el material', error);
      alert('No se pudo eliminar el material.');
    } finally {
      closeModals();
    }
  };

  const handleEditSuccess = () => {
    if (refreshMaterials) refreshMaterials();
    closeModals();
  };

  /**
   * @function formatPrice
   * @description Formatea el precio a moneda local (Peso Argentino).
   * @param {number} price - El precio a formatear.
   * @returns {string} El precio formateado con símbolo de moneda.
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  // Filter out deleted materials
  const activeMaterials = materials.filter(m => !m.is_deleted);

  // 4. Renderizado Condicional: Lista Vacía
  if (!materials || activeMaterials.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-box-seam display-4 text-muted"></i>
        <p className="text-muted mt-3">No tienes materiales registrados aún.</p>
        <p className="text-muted">Agrega productos a tu catálogo para que los clientes puedan verlos.</p>
      </div>
    );
  }

  // 5. Renderizado de la Tabla
  return (
    <>
      <div className="table-responsive">
        <Table striped hover className="mb-0">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio Unitario</th>
              <th>Unidad</th>
              {!isPublicView && (
                <>
                  <th>Adjuntos</th>
                  <th>Acciones</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {activeMaterials.map((material) => (
              <tr key={material.id_material}>
                <td>
                  <strong>{material.name}</strong>
                </td>
                <td>
                  <span className="text-muted">
                    {material.description || 'Sin descripción'}
                  </span>
                </td>
                <td>
                  <Badge bg="success" className="fs-6">
                    {formatPrice(material.unit_price)}
                  </Badge>
                </td>
                <td>
                  <span className="text-muted">{material.unit}</span>
                </td>
                {!isPublicView && (
                  <>
                    <td>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => openAttachmentsModal(material)}
                        title="Gestionar adjuntos"
                      >
                        <i className="bi bi-paperclip"></i>
                      </Button>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => openEditModal(material)}
                          title="Editar material"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => openDeleteModal(material)}
                          title="Eliminar material"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={closeModals} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar el material <strong>"{selectedMaterial?.name}"</strong>?
          <br />
          <small className="text-muted">El material se marcará como eliminado y no aparecerá en tu catálogo.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModals}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Sí, Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Material Modal */}
      <Modal show={showEditModal} onHide={closeModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MaterialForm 
            material={selectedMaterial} 
            onSuccess={handleEditSuccess}
            providerId={providerId}
          />
        </Modal.Body>
      </Modal>

      {/* Attachments Modal */}
      <Modal show={showAttachmentsModal} onHide={closeModals} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Adjuntos de {selectedMaterial?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MaterialAttachmentManager 
            materialId={selectedMaterial?.id_material}
            materialName={selectedMaterial?.name}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MaterialList;