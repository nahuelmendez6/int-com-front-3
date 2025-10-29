import React from 'react';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';

const renderBudgetFields = (item, index, handleBudgetChange) => {
  switch (item.cost_type) {
    case 'por_proyecto':
      return (
        <>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="number"
                value={item.amount || ''}
                onChange={(e) => handleBudgetChange(index, 'amount', e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Notas</Form.Label>
              <Form.Control
                type="text"
                value={item.notes || ''}
                onChange={(e) => handleBudgetChange(index, 'notes', e.target.value)}
              />
            </Form.Group>
          </Col>
        </>
      );
    case 'por_hora':
      return (
        <>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Horas</Form.Label>
              <Form.Control
                type="number"
                value={item.hours || ''}
                onChange={(e) => handleBudgetChange(index, 'hours', e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Precio/Hora</Form.Label>
              <Form.Control
                type="number"
                value={item.unit_price || ''}
                onChange={(e) => handleBudgetChange(index, 'unit_price', e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </>
      );
    case 'por_item':
      return (
        <>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                value={item.item_description || ''}
                onChange={(e) => handleBudgetChange(index, 'item_description', e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                value={item.quantity || ''}
                onChange={(e) => handleBudgetChange(index, 'quantity', e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Precio Unit.</Form.Label>
              <Form.Control
                type="number"
                value={item.unit_price || ''}
                onChange={(e) => handleBudgetChange(index, 'unit_price', e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </>
      );
    default:
      return null;
  }
};

export const BudgetSection = ({ budgetItems, setBudgetItems }) => {
  const handleBudgetChange = (index, field, value) => {
    const updated = [...budgetItems];
    updated[index][field] = value;
    setBudgetItems(updated);
  };

  const addBudgetItem = () =>
    setBudgetItems([...budgetItems, { cost_type: 'por_proyecto', amount: '', notes: '' }]);

  const removeBudgetItem = (index) =>
    setBudgetItems(budgetItems.filter((_, i) => i !== index));

  return (
    <Card className="mb-3">
      <Card.Header>Presupuesto</Card.Header>
      <Card.Body>
        {budgetItems.map((item, index) => (
          <Row key={index} className="mb-3 align-items-end">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Tipo de Costo</Form.Label>
                <Form.Select
                  value={item.cost_type}
                  onChange={(e) => handleBudgetChange(index, 'cost_type', e.target.value)}
                >
                  <option value="por_hora">Por Hora</option>
                  <option value="por_proyecto">Por Proyecto</option>
                  <option value="por_item">Por Ítem</option>
                </Form.Select>
              </Form.Group>
            </Col>
            {renderBudgetFields(item, index, handleBudgetChange)}
            <Col md={1}>
              <Button variant="danger" size="sm" onClick={() => removeBudgetItem(index)}>
                X
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="secondary" onClick={addBudgetItem}>
          + Añadir Presupuesto
        </Button>
      </Card.Body>
    </Card>
  );
};
