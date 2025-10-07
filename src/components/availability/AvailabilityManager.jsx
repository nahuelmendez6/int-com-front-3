// AvailabilityManager.jsx
import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth.js';
import {
  getProviderAvailability,
  updateProviderAvailability,
  deleteProviderAvailability,
  editProviderAvailability
} from '../../services/availability.service.js';
import ConfirmationModal from './ConfirmationModal.jsx';
import DayAvailability from './DayAvailability.jsx';

const daysMap = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  0: 'Domingo'
};
const dayDisplayOrder = [1, 2, 3, 4, 5, 6, 0];

const AvailabilityManager = () => {
  const { profile } = useAuth();

  const id_provider = profile?.profile?.id_provider;
  const role = profile?.role;

  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);

  const fetchAvailability = async () => {
    if (!id_provider || role !== 'provider') return;
    try {
      const data = await getProviderAvailability(id_provider);
      const availabilityMap = data.reduce((acc, item) => {
        const day = item.day_of_week;
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
      }, {});
      setAvailability(availabilityMap);
    } catch (err) {
      setError('Error al cargar la disponibilidad.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'provider' && id_provider) {
      fetchAvailability();
    } else {
      setLoading(false);
    }
  }, [id_provider, role]);

  const handleDeleteClick = (id) => {
    setSlotToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!slotToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteProviderAvailability(slotToDelete);
      setShowModal(false);
      setSlotToDelete(null);
      await fetchAvailability();
    } catch (err) {
      setError('Error al eliminar el horario.');
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (role === 'provider' && loading) return <Spinner animation="border" />;
  if (role !== 'provider')
    return <Alert variant="warning">Esta sección es solo para proveedores.</Alert>;

  return (
    <>
      <Card>
        <Card.Header as="h4">Gestionar Disponibilidad Semanal</Card.Header>
        <Card.Body>
          {error && (
            <Alert
              variant="danger"
              onClose={() => setError(null)}
              dismissible
            >
              {error}
            </Alert>
          )}
          <ListGroup variant="flush">
            {dayDisplayOrder.map((day) => (
              <DayAvailability
                key={day}
                day={day}
                dayName={daysMap[day]}
                slots={availability[day] || []}
                setAvailability={setAvailability}
                fetchAvailability={fetchAvailability}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                setError={setError}
                handleDeleteClick={handleDeleteClick}
                id_provider={id_provider}
              />
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message="¿Está seguro de que desea eliminar este horario?"
      />
    </>
  );
};

export default AvailabilityManager;
