// src/components/ratings/RatingCustomerForm.jsx
// =====================================================
// Componente: RatingCustomerForm
// -----------------------------------------------------
// Permite que un proveedor califique a un cliente luego de una interacción o trabajo finalizado.
// Incluye selección de estrellas (StarRating), campo de comentario opcional y manejo
// de validaciones, errores y mensajes de éxito.
//
// Dependencias:
//  - React y useState (manejo de estado local)
//  - React-Bootstrap (Form, Button, Alert)
//  - StarRating (componente visual reutilizable)
//  - gradesService (servicio para enviar la calificación al backend)
//  - useAuth (hook para obtener el usuario autenticado)
// =====================================================

import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import StarRating from '../common/StarRating';
import gradesService from '../../services/grades.service';
import { useAuth } from '../../hooks/useAuth';


// =====================================================
// Componente principal: RatingCustomerForm
// -----------------------------------------------------
// Renderiza un formulario de calificación para clientes. Solo los usuarios con rol
// "provider" pueden acceder y enviar la calificación.
//
// @param {Object} props
// @param {number} props.customerId - ID del cliente a calificar.
// @param {function} [props.onRatingSuccess] - Callback opcional que se ejecuta al enviar exitosamente la calificación.
//
// Flujo general:
//  1. El proveedor selecciona una cantidad de estrellas (1–5).
//  2. Puede agregar un comentario opcional.
//  3. Al enviar, se valida el rol y el puntaje, y se crea la calificación mediante gradesService.
//  4. Si el envío es exitoso, se muestra un mensaje y se limpia el formulario.
// =====================================================
const RatingCustomerForm = ({ customerId, onRatingSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();
  console.log("Se montó RatingCustomerForm:", { customerId });

    // =====================================================
  // Manejador del envío del formulario
  // -----------------------------------------------------
  // Valida la entrada y el rol del usuario antes de enviar los datos
  // al backend mediante el servicio `gradesService.createGradeForCustomer()`.
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validar que se haya elegido una calificación
    if (rating === 0) {
      setError('Por favor, selecciona una calificación.');
      return;
    }

     // Validar que el usuario tenga rol de proveedor
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

    // =====================================================
  // Restricción de acceso
  // -----------------------------------------------------
  // Si el usuario no es un proveedor, el componente no renderiza nada.
  // =====================================================
  if (!user || user.role !== 'provider') {
    return null; // No mostrar el formulario si el usuario no es un proveedor
  }


  // =====================================================
  // Renderizado del formulario
  // -----------------------------------------------------
  // Incluye selección de estrellas, comentario y mensajes de error/éxito.
  // =====================================================
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