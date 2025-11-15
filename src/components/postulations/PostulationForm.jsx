import React from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { usePostulationForm } from '../../hooks/usePostulationForm.js';
import { BudgetSection } from './BudgetSection.jsx';
import { MaterialSection } from './MaterialSection.jsx';


/**
 * @function PostulationForm
 * @description Componente de formulario que permite a un proveedor crear o editar
 * una postulación (oferta de servicio) para una petición.
 * Utiliza un hook personalizado (`usePostulationForm`) para manejar la lógica de estado
 * y la carga de datos necesarios (como materiales disponibles).
 * * @param {boolean} show - Controla si el Modal debe mostrarse.
 * @param {function} handleClose - Función que se llama al cerrar el Modal.
 * @param {function} onSubmit - Callback que maneja el envío final de los datos al componente padre.
 * @param {string | null} error - Mensaje de error a mostrar.
 * @param {boolean} submitting - Indica si el formulario está en proceso de envío (muestra 'Guardando...').
 * @param {object | null} initialData - Datos iniciales de una postulación existente para el modo Edición.
 * @param {number} providerId - ID del proveedor, necesario para el hook de formulario.
 * @returns {JSX.Element} Un Modal que contiene el formulario de postulación.
 */
const PostulationForm = ({ show, handleClose, onSubmit, error, submitting, initialData, providerId }) => {
  
  // 1. Hook Personalizado para la Lógica del Formulario
  // Este hook se encarga de:
  // - Inicializar los estados (propuesta, presupuestos, materiales) con `initialData` si existe.
  // - Cargar dinámicamente los materiales disponibles para el proveedor/petición.
  const {
    proposal,
    setProposal,
    budgetItems,
    setBudgetItems,
    materials,
    setMaterials,
    availableMaterials,
    loadingMaterials,
  } = usePostulationForm(initialData, providerId, show);
  
  /**
   * @function handleSubmit
   * @description Maneja el evento de envío del formulario.
   * Previene la recarga por defecto y pasa los datos consolidados al callback `onSubmit` del componente padre.
   * @param {Event} e - Evento de formulario.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      proposal,
      budgets: budgetItems,
      materials,
    });
  };

  return (
    // El Modal se configura para ser de tamaño grande ('lg') y tiene 'backdrop="static"' 
    // para evitar que se cierre al hacer clic fuera de él, forzando el uso del botón 'Cancelar'.
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? 'Editar Postulación' : 'Crear Postulación'}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Propuesta</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              required
            />
          </Form.Group>

          <BudgetSection budgetItems={budgetItems} setBudgetItems={setBudgetItems} />
          <MaterialSection
            materials={materials}
            setMaterials={setMaterials}
            availableMaterials={availableMaterials}
            loadingMaterials={loadingMaterials}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PostulationForm;
