import React, { useState } from 'react';
import portfolioService from '../../services/portfolio.service';
import { Button, Form } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth'


/**
 * @function PortfolioForm
 * @description Componente de formulario para crear o editar un proyecto de portfolio
 * de un proveedor. Maneja la lógica de envío de datos y la carga inicial de archivos
 * durante la creación.
 * * @param {function} onSuccess - Callback que se ejecuta tras una creación/actualización exitosa.
 * @param {object | null} portfolio - Objeto de portfolio existente si se está en modo edición.
 * @returns {JSX.Element} El formulario HTML/React con los campos del portfolio.
 */
const PortfolioForm = ({ onSuccess, portfolio = null }) => {

  // 1. Estados Locales
  // Inicializa los campos con datos existentes si `portfolio` está presente (Edición)
  const [name, setName] = useState(portfolio?.name || '');
  const [description, setDescription] = useState(portfolio?.description || '');

  // Para manejar la selección de archivos (solo se usa en el modo Creación)
  const [files, setFiles] = useState([]);

  // Manejo de errores de validación o API
  const [error, setError] = useState('');

  // Indica si la petición está en curso (deshabilita el botón)
  const [submitting, setSubmitting] = useState(false);

  // 2. Hook de Autenticación para obtener el ID del Proveedor
  const { profile } = useAuth();
  console.log('este es el id',profile.profile.id_provider)

  /**
   * @async
   * @function handleSubmit
   * @description Maneja el envío del formulario, distinguiendo entre creación y edición.
   * En creación, primero crea el proyecto y luego sube los archivos adjuntos.
   * @param {Event} e - Evento de formulario.
   */
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
        // --- MODO EDICIÓN ---
        // La actualización de archivos adjuntos se hace por separado, generalmente
        // en una vista de detalle diferente, ya que este formulario solo maneja los metadatos.
        await portfolioService.updatePortfolio(portfolio.id_portfolio, portfolioData);
        onSuccess();

      } else {
        // --- MODO CREACIÓN ---
        
        // 1. Crear el proyecto de portfolio
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
