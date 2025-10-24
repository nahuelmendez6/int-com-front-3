import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Card, Modal, Alert, Spinner } from 'react-bootstrap';
import materialService from '../../services/material.service';

const MaterialAttachmentManager = ({ materialId, materialName }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:8000';

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const response = await materialService.getMaterialAttachments(materialId);
      setAttachments(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar los adjuntos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (materialId) {
      fetchAttachments();
    }
  }, [materialId]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploadPromises = files.map(file => 
        materialService.createMaterialAttachment(materialId, file)
      );
      
      await Promise.all(uploadPromises);
      await fetchAttachments();
    } catch (err) {
      setError('Error al subir los archivos');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const openDeleteModal = (attachment) => {
    setAttachmentToDelete(attachment);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setAttachmentToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!attachmentToDelete) return;

    try {
      await materialService.deleteMaterialAttachment(attachmentToDelete.id_material_attachment);
      await fetchAttachments();
    } catch (err) {
      setError('Error al eliminar el adjunto');
      console.error(err);
    } finally {
      closeDeleteModal();
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const pdfExtensions = ['pdf'];
    const docExtensions = ['doc', 'docx'];
    const excelExtensions = ['xls', 'xlsx'];

    if (imageExtensions.includes(extension)) {
      return 'bi-image';
    } else if (pdfExtensions.includes(extension)) {
      return 'bi-file-pdf';
    } else if (docExtensions.includes(extension)) {
      return 'bi-file-word';
    } else if (excelExtensions.includes(extension)) {
      return 'bi-file-excel';
    } else {
      return 'bi-file';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2 text-muted">Cargando adjuntos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3">
        <h6 className="text-muted">Adjuntos de {materialName}</h6>
        <p className="text-muted small">
          Sube imágenes, documentos o archivos relacionados con este material.
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Upload Section */}
      <div className="mb-4">
        <div className="border rounded p-3 bg-light">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h6 className="mb-1">Agregar Archivos</h6>
              <small className="text-muted">
                Selecciona uno o más archivos para subir
              </small>
            </div>
            <div>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="d-none"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => document.getElementById('file-upload').click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cloud-upload me-2"></i>
                    Seleccionar Archivos
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Grid */}
      {attachments.length === 0 ? (
        <div className="text-center py-4">
          <i className="bi bi-paperclip display-4 text-muted"></i>
          <p className="text-muted mt-3">No hay adjuntos para este material</p>
          <p className="text-muted small">
            Sube imágenes, documentos o especificaciones técnicas
          </p>
        </div>
      ) : (
        <Row>
          {attachments.map((attachment) => (
            <Col md={6} lg={4} key={attachment.id_material_attachment} className="mb-3">
              <Card className="h-100">
                <Card.Body className="p-3">
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      <i className={`bi ${getFileIcon(attachment.file)} fs-4 text-primary`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 text-truncate" title={attachment.file}>
                        {attachment.file.split('/').pop()}
                      </h6>
                      <small className="text-muted d-block">
                        {formatDate(attachment.uploaded_at)}
                      </small>
                      <small className="text-muted">
                        {formatFileSize(attachment.file_size || 0)}
                      </small>
                    </div>
                    <div className="ms-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => openDeleteModal(attachment)}
                        title="Eliminar adjunto"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Preview for images */}
                  {attachment.file.match(/\.(jpeg|jpg|gif|png|webp)$/i) && (
                    <div className="mt-2">
                      <img
                        src={`${API_BASE_URL}${attachment.file}`}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: '100px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar este adjunto?
          <br />
          <small className="text-muted">
            Archivo: {attachmentToDelete?.file.split('/').pop()}
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Sí, Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MaterialAttachmentManager;
