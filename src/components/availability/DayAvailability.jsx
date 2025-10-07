// DayAvailability.jsx
import React from 'react';
import { ListGroup, Row, Col, Button } from 'react-bootstrap';
import TimeSlot from './TimeSlot';

const DayAvailability = ({ day, dayName, slots, setAvailability, fetchAvailability, isSubmitting, setIsSubmitting, setError, handleDeleteClick, id_provider }) => {
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
