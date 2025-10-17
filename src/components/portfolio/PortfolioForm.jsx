import React, { useState } from 'react';
import portfolioService from '../../services/portfolio.service';
import { Button, Form } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth'

const PortfolioForm = ({ onSuccess, portfolio = null }) => {
  const [name, setName] = useState(portfolio?.name || '');
  const [description, setDescription] = useState(portfolio?.description || '');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { profile } = useAuth();
  console.log('este es el id',profile.profile.id_provider)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const portfolioData = { 
      name, 
      description, 
      id_provider: profile.profile.id_provider 
    };

    try {
      if (portfolio) {
        // Update logic: attachments are handled separately in the detail page
        await portfolioService.updatePortfolio(portfolio.id_portfolio, portfolioData);
        onSuccess();

      } else {
        // Create logic: first create portfolio, then upload attachments
        const newPortfolioResponse = await portfolioService.createPortfolio(portfolioData);
        const newPortfolioId = newPortfolioResponse.data.id_portfolio;

        if (files.length > 0) {
          const uploadPromises = Array.from(files).map(file => 
            portfolioService.createAttachment(newPortfolioId, file)
          );
          await Promise.all(uploadPromises);
        }
        onSuccess();
      }
    } catch (err) {
      if (err.response && err.response.data) {
        // The backend sent back validation errors
        console.error("Validation Error:", err.response.data);
        // Extracts and formats error messages from the backend response
        const errorMessages = Object.entries(err.response.data).map(([field, messages]) => 
          `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
        ).join('; ');
        setError(`Error de validación: ${errorMessages}`);
      } else {
        // Generic error if the response format is unexpected
        setError('Error al guardar el proyecto. Por favor, inténtalo de nuevo.');
        console.error(err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <p className="text-danger">{error}</p>}
      <Form.Group className="mb-3">
        <Form.Label>Nombre del Proyecto</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>

      {/* File Input for Attachments - Only on Create */}
      {!portfolio && (
        <Form.Group className="mb-3">
          <Form.Label>Archivos Adjuntos</Form.Label>
          <Form.Control 
            type="file" 
            multiple 
            onChange={(e) => setFiles(e.target.files)}
          />
        </Form.Group>
      )}

      <Button variant="primary" type="submit" disabled={submitting}>
        {submitting ? 'Guardando...' : 'Guardar Proyecto'}
      </Button>
    </Form>
  );
};

export default PortfolioForm;
