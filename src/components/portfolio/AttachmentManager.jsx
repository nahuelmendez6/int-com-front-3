import React, { useState } from 'react';
import portfolioService from '../../services/portfolio.service';
import { Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';

const AttachmentManager = ({ portfolioId, attachments, refreshDetails }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      await portfolioService.createAttachment(portfolioId, file);
      setFile(null); 
      document.getElementById('file-input').value = '';
      refreshDetails();
    } catch (err) {
      setError('Error al subir el archivo.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      try {
        await portfolioService.deleteAttachment(attachmentId);
        refreshDetails();
      } catch (err) {
        console.error('Error al eliminar el archivo', err);
        alert('No se pudo eliminar el archivo.');
      }
    }
  };

  const renderAttachment = (att) => {
    const fileUrl = att.file; // Assuming the backend returns the full URL

    if (att.file_type === 'image') {
      return <Card.Img variant="top" src={fileUrl} style={{ maxHeight: '180px', objectFit: 'cover' }} />;
    }
    // Add video, document, etc. rendering as needed
    return (
      <div className="p-3 text-center">
        <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem' }}></i>
        <p>{att.file.split('/').pop()}</p>
      </div>
    );
  };

  return (
    <div>
      <h4>Archivos Adjuntos</h4>
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

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {attachments.map((att) => (
          <Col key={att.id_attachment}>
            <Card className="h-100">
              {renderAttachment(att)}
              <Card.Body className="d-flex flex-column">
                <Card.Title className="mt-auto pt-2">
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(att.id_attachment)}>
                    Eliminar
                  </Button>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {attachments.length === 0 && <p>No hay archivos adjuntos en este proyecto.</p>}
    </div>
  );
};

export default AttachmentManager;
