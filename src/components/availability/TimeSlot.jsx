// src/components/TimeSlot.jsx
// =====================================================
// Componente: TimeSlot
// -----------------------------------------------------
// Representa un bloque de horario individual dentro de la
// disponibilidad semanal de un proveedor.
//
// Este componente permite:
//  - Editar las horas de inicio y fin de una franja horaria.
//  - Crear o actualizar un horario llamando al servicio backend.
//  - Eliminar horarios existentes mediante un botón dedicado.
//
// Forma parte del módulo de gestión de disponibilidad del proveedor.
// =====================================================

import React, { memo } from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { updateProviderAvailability, editProviderAvailability } from '../../services/availability.service.js';


/**
 * Componente que permite visualizar y editar una franja horaria (TimeSlot)
 * de la disponibilidad semanal del proveedor.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.slot - Objeto que representa la franja horaria (con start_time, end_time, id_availability, etc.).
 * @param {number} props.index - Índice del slot dentro del arreglo de horarios del día.
 * @param {number} props.day - Día de la semana al que pertenece el slot (0=Domingo, 1=Lunes, etc.).
 * @param {Array} props.slots - Lista de franjas horarias correspondientes al día actual.
 * @param {Function} props.setAvailability - Función para actualizar el estado global de disponibilidad.
 * @param {Function} props.fetchAvailability - Función para recargar la disponibilidad desde el servidor.
 * @param {boolean} props.isSubmitting - Indica si hay una operación de guardado o eliminación en curso.
 * @param {Function} props.setIsSubmitting - Setter para actualizar el estado de envío.
 * @param {Function} props.setError - Setter para mostrar errores en el componente padre.
 * @param {Function} props.handleDeleteClick - Callback para eliminar un horario existente.
 * @param {number|string} props.id_provider - ID del proveedor autenticado.
 *
 * @example
 * <TimeSlot
 *   slot={slot}
 *   index={0}
 *   day={1}
 *   slots={slots}
 *   setAvailability={setAvailability}
 *   fetchAvailability={fetchAvailability}
 *   isSubmitting={isSubmitting}
 *   setIsSubmitting={setIsSubmitting}
 *   setError={setError}
 *   handleDeleteClick={handleDeleteClick}
 *   id_provider={23}
 * />
 */
const TimeSlot = ({ slot, index, day, setAvailability, isSubmitting, setIsSubmitting, setError, handleDeleteClick, id_provider }) => {
  
    /**
   * Actualiza el valor de un campo ("start_time" o "end_time") dentro del slot actual.
   * 
   * @param {"start_time"|"end_time"} field - Campo que se va a modificar.
   * @param {string} value - Nuevo valor ingresado (formato "HH:MM").
   */
  const handleTimeChange = (field, value) => {
    setAvailability(prev => {
      const daySlots = prev[day] || [];
      const updatedSlots = daySlots.map(s => {
        // Identifica el slot por su ID real o temporal
        if ((s.id_availability && s.id_availability === slot.id_availability) || (s.tempId && s.tempId === slot.tempId)) {
          return { ...s, [field]: value };
        }
        return s;
      });
      return { ...prev, [day]: updatedSlots };
    });
  };

    /**
   * Guarda o actualiza la franja horaria actual.
   * 
   * - Si `slot.id_availability` existe → se actualiza el registro.
   * - Si no existe → se crea un nuevo registro.
   * 
   * También maneja validaciones básicas (campos vacíos, proveedor indefinido).
   */
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

    // Guarda el estado original para poder revertir en caso de error.
    let originalSlots = [];
    setAvailability(prev => {
      originalSlots = [...(prev[day] || [])];
      return prev;
    });


    // Prepara el payload con formato adecuado para el backend
    const payload = {
      id_provider,
      day_of_week: day,
      start_time: slot.start_time.includes(':') && slot.start_time.length === 5 ? `${slot.start_time}:00` : slot.start_time,
      end_time: slot.end_time.includes(':') && slot.end_time.length === 5 ? `${slot.end_time}:00` : slot.end_time,
    };

    try {
      setError(null);
      if (slot.id_availability) {
        // Editar un horario existente
        const updatedSlot = await editProviderAvailability(slot.id_availability, payload);
        setAvailability((prev) => {
          const daySlots = prev[day] || [];
          const updatedSlots = daySlots.map((s) =>
            s.id_availability === updatedSlot.id_availability ? updatedSlot : s
          );
          return { ...prev, [day]: updatedSlots };
        });
      } else {
        // Crear un nuevo horario
        const newSlot = await updateProviderAvailability(payload);
        setAvailability((prev) => {
          const daySlots = prev[day] || [];
          const updatedSlots = daySlots.map((s) => {
            if (s.tempId === slot.tempId) return newSlot;
            return s;
          });
          return { ...prev, [day]: updatedSlots };
        });
      }
      // Ya no es necesario recargar todo.
      // await fetchAvailability(); 
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Error al guardar el horario. Verifique que los tiempos no se superpongan.';
      setError(errorMessage);
      // En caso de error, revierte los cambios en la UI al estado original.
      setAvailability(prev => ({ ...prev, [day]: originalSlots }));
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

export default memo(TimeSlot);
