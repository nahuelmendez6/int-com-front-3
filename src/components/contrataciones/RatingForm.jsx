import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import gradesService from '../../services/grades.service.js';

const Star = ({ marked, starId, onClick }) => (
  <span 
    style={{ cursor: 'pointer', fontSize: '2rem', color: marked ? '#ffc107' : '#e4e5e9' }} 
    onClick={() => onClick(starId)} 
    role="button"
  >
    ★
  </span>
);

const RatingForm = ({ providerId, id_postulation }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRatingClick = (starId) => {
    setRating(starId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Por favor, selecciona una calificación de estrellas.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const gradeData = {
      provider: providerId,
      grade: rating, // Asumiendo que grade y rating son lo mismo
      rating: rating,
      coment: comment,
      postulation: id_postulation, // Puede ser necesario para el backend
    };

    try {
      await gradesService.createGrade(gradeData);
      setSuccess('¡Gracias por tu calificación!');
      // Opcional: deshabilitar el formulario o esconderlo
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
