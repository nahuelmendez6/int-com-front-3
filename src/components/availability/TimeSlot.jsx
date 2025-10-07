// TimeSlot.jsx
import React from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { updateProviderAvailability, editProviderAvailability } from '../../services/availability.service.js';

const TimeSlot = ({ slot, index, day, slots, setAvailability, fetchAvailability, isSubmitting, setIsSubmitting, setError, handleDeleteClick, id_provider }) => {
  const handleTimeChange = (field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setAvailability(prev => ({ ...prev, [day]: updatedSlots }));
  };

  const handleSaveSlot = async () => {
    if (!slot.start_time || !slot.end_time) {
      setError('La hora de inicio y fin son obligatorias.');
      return;
    }

    if (!id_provider) {
      setError("No se pudo obtener el ID del proveedor. Intente recargar la página.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      id_provider,
      day_of_week: day,
      start_time: slot.start_time.includes(':') && slot.start_time.length === 5 ? `${slot.start_time}:00` : slot.start_time,
      end_time: slot.end_time.includes(':') && slot.end_time.length === 5 ? `${slot.end_time}:00` : slot.end_time,
    };

    try {
      setError(null);
      if (slot.id_availability) {
        await editProviderAvailability(slot.id_availability, payload);
      } else {
        await updateProviderAvailability(payload);
      }
      await fetchAvailability();
    } catch (err) {
      setError('Error al guardar el horario. Verifique que los tiempos no se superpongan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Row className="align-items-center mb-2">
      <Col md={4}>
        <Form.Control type="time" value={slot.start_time} onChange={e => handleTimeChange('start_time', e.target.value)} disabled={isSubmitting} />
      </Col>
      <Col md={4}>
        <Form.Control type="time" value={slot.end_time} onChange={e => handleTimeChange('end_time', e.target.value)} disabled={isSubmitting} />
      </Col>
      <Col md={2}>
        <Button variant="success" size="sm" onClick={handleSaveSlot} disabled={isSubmitting}>
          {isSubmitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> : 'Guardar'}
        </Button>
      </Col>
      <Col md={2}>
        {slot.id_availability && <Button variant="danger" size="sm" onClick={() => handleDeleteClick(slot.id_availability)} disabled={isSubmitting}>Eliminar</Button>}
      </Col>
    </Row>
  );
};

export default TimeSlot;
