import React, { useState } from 'react';
import portfolioService from '../../services/portfolio.service';
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';

/**
 * @function AttachmentManager
 * @description Componente utilizado en la vista de detalle de un portfolio para gestionar
 * los archivos adjuntos (subida, visualización y eliminación).
 * * @param {number} portfolioId - ID del proyecto de portfolio al que se adjuntan los archivos.
 * @param {object[]} attachments - Array de objetos adjuntos actuales del portfolio.
 * @param {function} refreshDetails - Callback para notificar al componente padre que debe recargar
 * los detalles del portfolio (incluyendo la nueva lista de adjuntos).
 * @returns {JSX.Element} La interfaz de gestión de archivos adjuntos.
 */
const AttachmentManager = ({ portfolioId, attachments, refreshDetails }) => {
  
  // 1. Estados Locales
  const [file, setFile] = useState(null);       // Archivo seleccionado para subir
  const [uploading, setUploading] = useState(false); // Estado de subida en curso
  const [error, setError] = useState('');           // Mensaje de error

  // 2. Handlers de Archivo y Subida

  /**
   * @function handleFileChange
   * @description Almacena el primer archivo seleccionado en el estado `file`.
   * @param {Event} e - Evento de cambio del input de archivo.
   */
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  /**
   * @async
   * @function handleUpload
   * @description Sube el archivo seleccionado a la API del portfolio.
   */
  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      await portfolioService.createAttachment(portfolioId, file);
      // Limpia el estado y el input después de una subida exitosa
      setFile(null); 
      document.getElementById('file-input').value = '';
      refreshDetails(); // Solicita la recarga de la lista
    } catch (err) {
      setError('Error al subir el archivo.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  /**
   * @async
   * @function handleDelete
   * @description Elimina un archivo adjunto por su ID previa confirmación.
   * @param {number} attachmentId - ID del adjunto a eliminar.
   */
  const handleDelete = async (attachmentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      try {
        await portfolioService.deleteAttachment(attachmentId);
        refreshDetails(); // Solicita la recarga de la lista
      } catch (err) {
        console.error('Error al eliminar el archivo', err);
        alert('No se pudo eliminar el archivo.');
      }
    }
  };

  /**
   * @function renderAttachment
   * @description Renderiza la previsualización del adjunto basado en su tipo (actualmente, solo imágenes).
   * @param {object} att - Objeto del adjunto.
   * @returns {JSX.Element} El componente de visualización (imagen o icono).
   */
  const renderAttachment = (att) => {
    const fileUrl = att.file; 

    // Muestra la imagen si el tipo de archivo es 'image'
    if (att.file_type === 'image') {
      return <Card.Img variant="top" src={fileUrl} style={{ maxHeight: '180px', objectFit: 'cover' }} />;
    }
    // Para otros tipos de archivo, muestra un icono
    return (
      <div className="p-3 text-center">
        <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem' }}></i>
        <p>{att.file.split('/').pop()}</p>
      </div>
    );
  };

  // 3. Renderizado
  return (
    <div>
      <h4>Archivos Adjuntos</h4>
      
      {/* Sección de Subida de Archivos */}
      <div className="mb-4 p-3 border rounded">
        <h5>Subir Nuevo Archivo</h5>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form.Group>
          <Form.Control type="file" id="file-input" onChange={handleFileChange} className="mb-2" />
        </Form.Group>
        
        <Button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? 'Subiendo...' : 'Subir Archivo'}
        </Button>
      </div>

      {/* Grid de Adjuntos Existentes */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {attachments.map((att) => (
          <Col key={att.id_attachment}>
            <Card className="h-100">
              {renderAttachment(att)}
              <Card.Body className="d-flex flex-column">
                <Card.Title className="mt-auto pt-2">
                  {/* Botón para eliminar el adjunto */}
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(att.id_attachment)}>
                    Eliminar
                  </Button>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Mensaje si la lista está vacía */}
      {attachments.length === 0 && <p>No hay archivos adjuntos en este proyecto.</p>}
    </div>
  );
};

export default AttachmentManager;