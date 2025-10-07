import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const PersonalInfoForm = ({ formData, handleChange }) => (
  <>
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm={4} className="form-label text-sm-end">Email</Form.Label>
      <Col sm={8}>
        <Form.Control
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
        />
      </Col>
    </Form.Group>
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm={4} className="form-label text-sm-end">Nombre</Form.Label>
      <Col sm={8}>
        <Form.Control
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
        />
      </Col>
    </Form.Group>
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm={4} className="form-label text-sm-end">Apellido</Form.Label>
      <Col sm={8}>
        <Form.Control
          required
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          className="form-control"
        />
      </Col>
    </Form.Group>
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm={4} className="form-label text-sm-end">Contraseña</Form.Label>
      <Col sm={8}>
        <Form.Control
          required
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
          placeholder="6 o más caracteres"
        />
      </Col>
    </Form.Group>
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm={4} className="form-label text-sm-end">Confirmar</Form.Label>
      <Col sm={8}>
        <Form.Control
          required
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-control"
        />
      </Col>
    </Form.Group>
  </>
);

export default PersonalInfoForm;
