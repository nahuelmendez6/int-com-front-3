// AvailabilityManager.jsx

// src/components/AvailabilityManager.jsx
// =====================================================
// Componente: AvailabilityManager
// -----------------------------------------------------
// Permite a los proveedores gestionar su disponibilidad semanal.
// Muestra los horarios agrupados por día, permite eliminarlos,
// y se integra con el servicio de disponibilidad del backend.
//
// Este componente solo es accesible para usuarios con rol "provider".
// Incluye manejo de carga, errores, confirmaciones y actualizaciones dinámicas.
// =====================================================
import React, { useState, useEffect, useCallback } from 'react';
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


// Mapa de días de la semana (numérico → nombre en español)
const daysMap = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  0: 'Domingo'
};

// Orden de visualización (lunes → domingo)
const dayDisplayOrder = [1, 2, 3, 4, 5, 6, 0];


/**
 * Componente que gestiona la disponibilidad semanal del proveedor.
 *
 * - Muestra los horarios disponibles por día.
 * - Permite eliminar o editar slots de disponibilidad.
 * - Solo accesible para usuarios con rol de proveedor.
 *
 * @component
 * @returns {JSX.Element} Interfaz para administrar la disponibilidad semanal del proveedor.
 *
 * @example
 * // Ejemplo de uso dentro de un panel de proveedor:
 * <AvailabilityManager />
 */
const AvailabilityManager = () => {
  const { profile } = useAuth();

  // Extrae el ID del proveedor y su rol desde el contexto de autenticación
  const id_provider = profile?.profile?.id_provider;
  const role = profile?.role;

  // Estado local del componente
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);


    /**
   * Obtiene la disponibilidad del proveedor desde la API y
   * la agrupa por día de la semana.
   */
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
  /**
   * Efecto que carga la disponibilidad cuando el usuario
   * autenticado es un proveedor válido.
   */
  useEffect(() => {
    if (role === 'provider' && id_provider) {
      fetchAvailability();
    } else {
      setLoading(false);
    }
  }, [id_provider, role]);
  /**
   * Maneja el clic para eliminar un horario (slot) mostrando el modal de confirmación.
   * @param {number} id - ID del slot de disponibilidad a eliminar.
   */
  const handleDeleteClick = useCallback((id) => {
    setSlotToDelete(id);
    setShowModal(true);
  }, []);
  /**
   * Confirma la eliminación del horario seleccionado y actualiza la lista.
   */
  const confirmDelete = async () => {
    if (!slotToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteProviderAvailability(slotToDelete);
      // Actualiza el estado local para reflejar la eliminación sin recargar todo.
      setAvailability((prev) => {
        const newAvailability = { ...prev };
        for (const day in newAvailability) {
          newAvailability[day] = newAvailability[day].filter(
            (slot) => slot.id_availability !== slotToDelete
          );
        }
        return newAvailability;
      });
      setShowModal(false);
      setSlotToDelete(null);
    } catch (err) {
      setError('Error al eliminar el horario.');
      // Asegurarse de cerrar el modal incluso si hay un error
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estado de carga o acceso restringido
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
