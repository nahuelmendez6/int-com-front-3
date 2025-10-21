import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Alert } from 'react-bootstrap';

const PostulationForm = ({ show, handleClose, onSubmit, error, submitting, initialData }) => {
  const [proposal, setProposal] = useState('');
  const [budgetItems, setBudgetItems] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    if (initialData) {
      setProposal(initialData.proposal || '');
      setBudgetItems(initialData.budgets || []);
      setMaterials(initialData.materials || []);
    } else {
      // Reset form for creation
      setProposal('');
      setBudgetItems([]);
      setMaterials([]);
    }
  }, [initialData, show]);

  const handleBudgetChange = (index, field, value) => {
    const newBudgetItems = [...budgetItems];
    newBudgetItems[index][field] = value;
    setBudgetItems(newBudgetItems);
  };

  const addBudgetItem = () => {
    setBudgetItems([...budgetItems, { cost_type: 'por_proyecto', amount: '', unit_price: '', quantity: '', hours: '', item_description: '', notes: '' }]);
  };

  const removeBudgetItem = (index) => {
    const newBudgetItems = budgetItems.filter((_, i) => i !== index);
    setBudgetItems(newBudgetItems);
  };

  const handleMaterialChange = (index, field, value) => {
    const newMaterials = [...materials];
    newMaterials[index][field] = value;
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = parseFloat(newMaterials[index].quantity) || 0;
      const unit_price = parseFloat(newMaterials[index].unit_price) || 0;
      newMaterials[index].total = (quantity * unit_price).toFixed(2);
    }
    setMaterials(newMaterials);
  };

  const addMaterial = () => {
    setMaterials([...materials, { id_material: '', quantity: '', unit_price: '', total: '0.00', notes: '' }]);
  };

  const removeMaterial = (index) => {
    const newMaterials = materials.filter((_, i) => i !== index);
    setMaterials(newMaterials);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const postulationData = {
      proposal,
      budgets: budgetItems.map(item => ({
        ...item,
        amount: item.amount ? parseFloat(item.amount) : null,
        unit_price: item.unit_price ? parseFloat(item.unit_price) : null,
        quantity: item.quantity ? parseInt(item.quantity) : null,
        hours: item.hours ? parseFloat(item.hours) : null,
      })),
      materials: materials.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity),
        unit_price: parseFloat(item.unit_price),
        total: parseFloat(item.total),
      })),
    };
    onSubmit(postulationData);
  };

  const renderBudgetFields = (item, index) => {
    // ... (same as before)
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
            <Form.Control as="textarea" rows={3} value={proposal} onChange={(e) => setProposal(e.target.value)} required placeholder="Describe tu propuesta detalladamente..." />
          </Form.Group>

          <Card className="mb-3">
            <Card.Header>Presupuesto</Card.Header>
            <Card.Body>
              {budgetItems.map((item, index) => (
                <Row key={index} className="mb-3 align-items-end">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Tipo de Costo</Form.Label>
                      <Form.Select value={item.cost_type} onChange={(e) => handleBudgetChange(index, 'cost_type', e.target.value)}>
                        <option value="por_hora">Por Hora</option>
                        <option value="por_proyecto">Por Proyecto</option>
                        <option value="por_item">Por Ítem</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {renderBudgetFields(item, index)}
                  <Col md={1}>
                    <Button variant="danger" size="sm" onClick={() => removeBudgetItem(index)}>X</Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" onClick={addBudgetItem}>+ Añadir Presupuesto</Button>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Materiales (Opcional)</Card.Header>
            <Card.Body>
              {materials.map((item, index) => (
                <Row key={index} className="mb-3 align-items-end">
                  <Col md={3}><Form.Group><Form.Label>Material</Form.Label><Form.Control type="text" placeholder="Nombre o ID" value={item.id_material} onChange={(e) => handleMaterialChange(index, 'id_material', e.target.value)} /></Form.Group></Col>
                  <Col md={2}><Form.Group><Form.Label>Cantidad</Form.Label><Form.Control type="number" placeholder="0" value={item.quantity} onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)} /></Form.Group></Col>
                  <Col md={2}><Form.Group><Form.Label>Precio Unit.</Form.Label><Form.Control type="number" placeholder="0.00" value={item.unit_price} onChange={(e) => handleMaterialChange(index, 'unit_price', e.target.value)} /></Form.Group></Col>
                  <Col md={2}><Form.Group><Form.Label>Total</Form.Label><Form.Control type="text" readOnly value={item.total} /></Form.Group></Col>
                  <Col md={2}><Form.Group><Form.Label>Notas</Form.Label><Form.Control type="text" placeholder="Notas" value={item.notes} onChange={(e) => handleMaterialChange(index, 'notes', e.target.value)} /></Form.Group></Col>
                  <Col md={1}><Button variant="danger" size="sm" onClick={() => removeMaterial(index)}>X</Button></Col>
                </Row>
              ))}
              <Button variant="secondary" onClick={addMaterial}>+ Añadir Material</Button>
            </Card.Body>
          </Card>

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