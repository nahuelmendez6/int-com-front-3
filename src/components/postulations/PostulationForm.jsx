import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';

const PostulationForm = ({ petitionId, onSubmit, error, submitting }) => {
  const [proposal, setProposal] = useState('');
  const [costType, setCostType] = useState('por_proyecto');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const budget = {
      cost_type: costType,
      amount: parseFloat(amount),
    };
    onSubmit({ proposal, budget });
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Postularse a la Petición</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="proposal">
            <Form.Label>Propuesta</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="costType">
            <Form.Label>Tipo de Costo</Form.Label>
            <Form.Control
              as="select"
              value={costType}
              onChange={(e) => setCostType(e.target.value)}
            >
              <option value="por_proyecto">Por Proyecto</option>
              <option value="por_hora">Por Hora</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Postularse'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PostulationForm;
