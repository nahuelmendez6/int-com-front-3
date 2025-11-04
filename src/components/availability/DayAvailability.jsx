// DayAvailability.jsx

// src/components/DayAvailability.jsx
// =====================================================
// Componente: DayAvailability
// -----------------------------------------------------
// Renderiza y gestiona los horarios de disponibilidad
// de un proveedor para un día específico de la semana.
//
// Permite:
//  - Mostrar los horarios existentes.
//  - Agregar nuevos horarios vacíos.
//  - Editar o eliminar horarios mediante el componente TimeSlot.
//
// Este componente forma parte del sistema de gestión de
// disponibilidad semanal del proveedor (AvailabilityManager).
// =====================================================
import React from 'react';
import { ListGroup, Row, Col, Button } from 'react-bootstrap';
import TimeSlot from './TimeSlot';


/**
 * Componente que muestra los horarios disponibles de un día específico.
 *
 * Permite agregar, modificar o eliminar horarios asociados a un día.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {number} props.day - Número del día de la semana (0=Domingo, 1=Lunes, ... 6=Sábado).
 * @param {string} props.dayName - Nombre del día (ejemplo: "Lunes").
 * @param {Array<Object>} props.slots - Lista de franjas horarias del día.
 * @param {Function} props.setAvailability - Función para actualizar el estado de disponibilidad.
 * @param {Function} props.fetchAvailability - Función para recargar la disponibilidad desde el servidor.
 * @param {boolean} props.isSubmitting - Indica si hay una operación en curso (para deshabilitar botones).
 * @param {Function} props.setIsSubmitting - Cambia el estado de envío para bloquear UI mientras se guarda.
 * @param {Function} props.setError - Muestra errores en caso de fallo de red o validación.
 * @param {Function} props.handleDeleteClick - Abre el modal de confirmación para eliminar una franja horaria.
 * @param {number} props.id_provider - ID del proveedor asociado a la disponibilidad.
 *
 * @returns {JSX.Element} Un bloque con los horarios del día y un botón para añadir nuevos.
 *
 * @example
 * <DayAvailability
 *   day={1}
 *   dayName="Lunes"
 *   slots={[{ id_availability: 1, start_time: "08:00", end_time: "12:00" }]}
 *   setAvailability={setAvailability}
 *   fetchAvailability={fetchAvailability}
 *   isSubmitting={isSubmitting}
 *   setIsSubmitting={setIsSubmitting}
 *   setError={setError}
 *   handleDeleteClick={handleDeleteClick}
 *   id_provider={5}
 * />
 */
const DayAvailability = ({ day, dayName, slots, setAvailability, fetchAvailability, isSubmitting, setIsSubmitting, setError, handleDeleteClick, id_provider }) => {
  
    /**
   * Agrega un nuevo horario vacío a la lista del día actual.
   * Se usa cuando el proveedor desea añadir una nueva franja horaria.
   */
  const handleAddNewSlot = () => {
    const newSlot = { id_availability: null, start_time: '', end_time: '' };
    const daySlots = [...slots, newSlot];
    setAvailability(prev => ({ ...prev, [day]: daySlots }));
  };

  return (
    <ListGroup.Item className="p-3">
      <h5>{dayName}</h5>
      {slots.map((slot, index) => (
        <TimeSlot
          key={slot.id_availability || `new-${index}`}
          slot={slot}
          index={index}
          day={day}
          slots={slots}
          setAvailability={setAvailability}
          fetchAvailability={fetchAvailability}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          setError={setError}
          handleDeleteClick={handleDeleteClick}
          id_provider={id_provider}
        />
      ))}
      <Button variant="primary" size="sm" className="mt-2" onClick={handleAddNewSlot} disabled={isSubmitting}>+ Añadir horario</Button>
    </ListGroup.Item>
  );
};

export default DayAvailability;
