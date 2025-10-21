import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useProviderRegistrationForm from '../hooks/useProviderRegistrationForm.js';
import PersonalInfoForm from '../components/auth/PersonalInforForm.jsx';
import '../Form.css';

const ProviderRegistrationForm = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    errors,
    successMessage,
  } = useProviderRegistrationForm();
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <p className="title">Registro de Proveedor</p>
      <Form onSubmit={handleSubmit} noValidate className="form">
        <PersonalInfoForm formData={formData} handleChange={handleChange} />
        
        {errors && <Alert variant="danger" className="mt-3">{errors}</Alert>}
        {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}

        <p className="terms-text" style={{fontSize: '10px', textAlign: 'center'}}>
          Al hacer clic en Aceptar y continuar, aceptas las Condiciones de uso, la Política de privacidad y la Política de cookies de Integracion Comunitaria.
        </p>

        <Button type="submit" className="form-btn" disabled={loading}>
          {loading ? 'Registrando...' : 'Aceptar y continuar'}
        </Button>
      </Form>
      <p className="sign-up-label">
        ¿Ya tienes una cuenta? <a href="/login" className="sign-up-link">Inicia sesión</a>
      </p>
    </div>
  );
};

export default ProviderRegistrationForm;