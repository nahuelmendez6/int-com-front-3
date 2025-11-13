// src/components/PersonalInfoForm.jsx
// =====================================================
// Componente: PersonalInfoForm
// -----------------------------------------------------
// Formulario reutilizable que gestiona los datos personales
// básicos de un usuario: email, nombre, apellido y contraseñas.
//
// Este componente es controlado externamente mediante los props
// `formData` (estado actual del formulario) y `handleChange`
// (función para manejar actualizaciones de los campos).
//
// Ideal para usarse dentro de formularios de registro o edición
// de perfil de usuario.
// =====================================================

import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';


/**
 * Renderiza un conjunto de campos de información personal.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.formData - Objeto con los valores actuales del formulario.
 * @param {Function} props.handleChange - Función para manejar los cambios en los inputs.
 *
 * @returns {JSX.Element} Sección de formulario con campos personales.
 *
 * @example
 * // Ejemplo de uso:
 * <PersonalInfoForm
 *   formData={formData}
 *   handleChange={handleChange}
 * />
 */
const PersonalInfoForm = ({ formData, handleChange }) => (
  <>
    <Form.Group className="mb-2">
      <Form.Control
        required
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="form-control input wide-input"
        placeholder="Correo electrónico"
      />
    </Form.Group>
    <Form.Group className="mb-2">
      <Form.Control
        required
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="form-control input wide-input"
        placeholder="Nombre"
      />
    </Form.Group>
    <Form.Group className="mb-2">
      <Form.Control
        required
        type="text"
        name="lastname"
        value={formData.lastname}
        onChange={handleChange}
        className="form-control input wide-input"
        placeholder="Apellido"
      />
    </Form.Group>
    <Form.Group className="mb-2">
      <Form.Control
        required
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="form-control input wide-input"
        placeholder="Contraseña (6 o más caracteres)"
      />
    </Form.Group>
    <Form.Group className="mb-2">
      <Form.Control
        required
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        className="form-control input wide-input"
        placeholder="Confirmar contraseña"
      />
    </Form.Group>
  </>
);

export default PersonalInfoForm;
