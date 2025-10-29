import React from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { usePostulationForm } from '../../hooks/usePostulationForm.js';
import { BudgetSection } from './BudgetSection.jsx';
import { MaterialSection } from './MaterialSection.jsx';

const PostulationForm = ({ show, handleClose, onSubmit, error, submitting, initialData, providerId }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      proposal,
      budgets: budgetItems,
      materials,
    });
  };

  return (
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
