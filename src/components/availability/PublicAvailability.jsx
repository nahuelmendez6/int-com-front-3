import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { getProviderAvailability } from '../../services/availability.service.js';

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

const formatTime = (time) => {
  if (!time) return '';
  // Expecting HH:MM[:SS], display HH:MM
  const [hh, mm] = time.split(':');
  return `${hh}:${mm}`;
};

const PublicAvailability = ({ providerId }) => {
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProviderAvailability(providerId);
        const availabilityMap = data.reduce((acc, item) => {
          const day = item.day_of_week;
          if (!acc[day]) acc[day] = [];
          acc[day].push(item);
          return acc;
        }, {});
        // Sort each day's slots by start_time
        Object.keys(availabilityMap).forEach((d) => {
          availabilityMap[d].sort((a, b) => (a.start_time > b.start_time ? 1 : -1));
        });
        setAvailability(availabilityMap);
      } catch (e) {
        setError('No se pudo cargar la disponibilidad del proveedor.');
      } finally {
        setLoading(false);
      }
    };

    if (providerId) fetchAvailability();
  }, [providerId]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="mt-4">
      <Card.Header as="h4">Disponibilidad</Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {dayDisplayOrder.map((day) => {
            const slots = availability[day] || [];
            return (
              <ListGroup.Item key={day} className="d-flex align-items-center justify-content-between flex-wrap">
                <div className="fw-semibold mb-2 mb-sm-0">{daysMap[day]}</div>
                <div>
                  {slots.length > 0 ? (
                    slots.map((s) => (
                      <Badge bg="secondary" key={s.id_availability} className="me-2 mb-2">
                        {formatTime(s.start_time)} - {formatTime(s.end_time)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">Sin horarios</span>
                  )}
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default PublicAvailability;


