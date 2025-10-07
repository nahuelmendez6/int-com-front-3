
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth.service.js';

const useCustomerRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    lastname: '',
    role: 'customer',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrors('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...dataToSend } = formData;

    try {
      await registerUser(dataToSend);
      setSuccessMessage('¡Registro exitoso!');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      console.error('Error en registro:', err);
      const errorMsg =
        err.detail ||
        err.message ||
        (typeof err === 'string' ? err : 'Error al registrar usuario');
      setErrors(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    errors,
    successMessage,
  };
};

export default useCustomerRegistrationForm;
