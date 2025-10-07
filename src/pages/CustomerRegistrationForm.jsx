import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useCustomerRegistrationForm from '../hooks/useCustomerRegistrationForm.js';
import PersonalInfoForm from '../components/auth/PersonalInforForm.jsx';
// import './RegistrationForm.css';

const ProviderRegistrationForm = () => {
  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    errors,
    successMessage,
  } = useCustomerRegistrationForm();
  const navigate = useNavigate();

  return (
    <div className="registration-page">
      <header className="registration-header">
        {/* <a href="/" className="logo">Integracion Comunitaria</a> */}
        {/* <h1 className="subtitle">Saca el máximo partido a tu vida profesional</h1> */}
      </header>
      <div className="registration-card">
        <Form onSubmit={handleSubmit} noValidate>
          <PersonalInfoForm formData={formData} handleChange={handleChange} />
          
          {errors && <Alert variant="danger" className="mt-3">{errors}</Alert>}
          {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}

          <p className="terms-text">
            Al hacer clic en Aceptar y continuar, aceptas las Condiciones de uso, la Política de privacidad y la Política de cookies de Integracion Comunitaria.
          </p>

          <Button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Aceptar y continuar'}
          </Button>
        </Form>
        <div className="login-link">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistrationForm;