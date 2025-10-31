import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import StarRating from '../common/StarRating';
import gradesService from '../../services/grades.service';
import { useAuth } from '../../hooks/useAuth';

const RatingCustomerForm = ({ customerId, onRatingSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();
  console.log("📋 Se montó RatingCustomerForm:", { customerId });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (rating === 0) {
      setError('Por favor, selecciona una calificación.');
      return;
    }

    if (!user || user.role !== 'provider') {
      setError('Solo los proveedores pueden calificar a los clientes.');
      return;
    }

    try {
      const gradeData = {
        customer: customerId,
        provider: user.id,
        rating,
        comment,
        user_create: user.id,
        user_update: user.id,
      };
      await gradesService.createGradeForCustomer(gradeData);
      setSuccess('Calificación enviada con éxito.');
      setRating(0);
      setComment('');
      if (onRatingSuccess) {
        onRatingSuccess();
      }
    } catch (err) {
      setError('Error al enviar la calificación. Es posible que ya hayas calificado a este cliente.');
      console.error(err);
    }
  };

  if (!user || user.role !== 'provider') {
    return null; // No mostrar el formulario si el usuario no es un proveedor
  }

  return (
    <div className="mt-4">
      <h4>Calificar a este cliente</h4>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form.Group className="mb-3">
          <Form.Label>Calificación</Form.Label>
          <StarRating rating={rating} setRating={setRating} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Comentario</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Deja un comentario (opcional)"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Enviar Calificación
        </Button>
      </Form>
    </div>
  );
};

export default RatingCustomerForm;
