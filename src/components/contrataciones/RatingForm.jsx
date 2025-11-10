// src/components/RatingForm.jsx
// =====================================================
// Componente: RatingForm
// -----------------------------------------------------
// Permite al cliente calificar a un proveedor luego de una
// contratación aprobada. Incluye selección de estrellas (1–5),
// comentario opcional y validación básica.
//
// Se comunica con el backend a través de `gradesService`
// para guardar la calificación.
//
// Dependencias:
//  - React y React-Bootstrap para la interfaz
//  - gradesService: servicio HTTP para manejar calificaciones
// =====================================================

import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import gradesService from '../../services/grades.service.js';
import { useAuth } from '../../hooks/useAuth';


/**
 * Componente visual para representar una estrella dentro del sistema de calificación.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.marked - Indica si la estrella está seleccionada.
 * @param {number} props.starId - Número de la estrella (1 a 5).
 * @param {function} props.onClick - Función manejadora al hacer clic.
 */
const Star = ({ marked, starId, onClick }) => (
  <span 
    style={{ cursor: 'pointer', fontSize: '2rem', color: marked ? '#ffc107' : '#e4e5e9' }} 
    onClick={() => onClick(starId)} 
    role="button"
  >
    ★
  </span>
);


/**
 * Formulario de calificación del proveedor.
 * Permite al cliente seleccionar estrellas, escribir un comentario
 * y enviar la información al servidor mediante el servicio `gradesService`.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {number} props.providerId - ID del proveedor a calificar.
 * @param {number} props.id_postulation - ID de la contratación (postulación) relacionada.
 *
 * @example
 * <RatingForm providerId={12} id_postulation={45} />
 */
const RatingForm = ({ providerId, id_postulation }) => {
  const { user } = useAuth();

  // Estado local del formulario
  const [rating, setRating] = useState(0);  // número de estrellas seleccionadas
  const [comment, setComment] = useState(''); // comentario textual
  const [error, setError] = useState(null);   // mensaje de error
  const [success, setSuccess] = useState(null); // mensaje de éxito
  const [submitting, setSubmitting] = useState(false);  // control de envío


    /**
   * Maneja el clic sobre una estrella, actualizando la calificación seleccionada.
   * @param {number} starId - Valor de la estrella seleccionada (1–5)
   */
  const handleRatingClick = (starId) => {
    setRating(starId);
  };

    /**
   * Maneja el envío del formulario de calificación.
   * Valida los campos, construye el objeto `gradeData` y
   * llama al servicio `gradesService.createGrade()`.
   *
   * @param {Event} e - Evento de formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: se debe seleccionar al menos una estrella
    if (rating === 0) {
      setError('Por favor, selecciona una calificación de estrellas.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Datos enviados al backend
    const gradeData = {
      provider: providerId, // id_user del proveedor a calificar
      grade: rating, // Asumiendo que grade y rating son lo mismo
      rating: rating,
      coment: comment,
      postulation: id_postulation, // Puede ser necesario para el backend
    };

    try {
      await gradesService.createGrade(gradeData);
      setSuccess('¡Gracias por tu calificación!');
    } catch (err) {
      setError('Hubo un error al enviar tu calificación. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <Alert variant="success">{success}</Alert>;
  }

  return (
    <Form onSubmit={handleSubmit} className="mt-3 border-top pt-3">
      <h6 className="mb-2">Calificar al Proveedor</h6>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label className="mb-1">Tu calificación:</Form.Label>
        <div>
          {[1, 2, 3, 4, 5].map(starId => (
            <Star key={starId} starId={starId} marked={rating >= starId} onClick={handleRatingClick} />
          ))}
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Comentario (opcional):</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Describe tu experiencia con el proveedor..."
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Enviar Calificación'}
      </Button>
    </Form>
  );
};

export default RatingForm;
