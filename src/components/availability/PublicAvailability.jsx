// src/components/PublicAvailability.jsx
// =====================================================
// Componente: PublicAvailability
// -----------------------------------------------------
// Muestra la disponibilidad pública de un proveedor,
// organizada por días de la semana.
//
// Este componente:
//  - Obtiene los datos desde el servicio `availability.service.js`.
//  - Agrupa y ordena las franjas horarias por día.
//  - Presenta los horarios en un formato legible con badges.
//  - Maneja estados de carga y error.
//
// Es ideal para páginas de perfil de proveedor o vistas públicas.
// =====================================================

import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Alert, Spinner, Badge } from 'react-bootstrap';
import { getProviderAvailability } from '../../services/availability.service.js';

// Mapeo de días numéricos (usados en la base de datos) a nombres en español
const daysMap = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  0: 'Domingo'
};

// Orden en el que se mostrarán los días (lunes a domingo)
const dayDisplayOrder = [1, 2, 3, 4, 5, 6, 0];


/**
 * Formatea una hora con formato "HH:MM:SS" o "HH:MM" a "HH:MM".
 * 
 * @param {string} time - Hora en formato "HH:MM" o "HH:MM:SS".
 * @returns {string} La hora formateada para mostrar.
 */
const formatTime = (time) => {
  if (!time) return '';
  // Expecting HH:MM[:SS], display HH:MM
  const [hh, mm] = time.split(':');
  return `${hh}:${mm}`;
};

/**
 * Componente que muestra la disponibilidad semanal pública de un proveedor.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {number|string} props.providerId - ID del proveedor del cual obtener la disponibilidad.
 * 
 * @example
 * <PublicAvailability providerId={23} />
 */
const PublicAvailability = ({ providerId }) => {
  // Estado para guardar la disponibilidad agrupada por día
  const [availability, setAvailability] = useState({});

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Estado de error (para mensajes de alerta)
  const [error, setError] = useState(null);

    /**
   * Efecto que obtiene la disponibilidad del proveedor al montar el componente
   * o cuando cambia el `providerId`.
   */
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      try {

        // Llamada al servicio backend
        const data = await getProviderAvailability(providerId);

        // Agrupar los horarios por día de la semana
        const availabilityMap = data.reduce((acc, item) => {
          const day = item.day_of_week;
          if (!acc[day]) acc[day] = [];
          acc[day].push(item);
          return acc;
        }, {});
         // Ordenar las franjas horarias dentro de cada día
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

    // --------------------------------------------------
  // Renderizado condicional
  // --------------------------------------------------
  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;


  // --------------------------------------------------
  // Render principal
  // --------------------------------------------------
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


