
/**
 * Custom Hook: useProviderRegistrationForm
 *
 * Este hook encapsula toda la lógica del formulario de registro de proveedores,
 * estructurado como un formulario multi-step (dividido por pasos).
 * 
 * Se encarga de:
 * - Manejar el estado de todos los campos del formulario.
 * - Validar las contraseñas antes de enviar los datos.
 * - Gestionar el envío al backend mediante el servicio de autenticación.
 * - Redirigir al usuario a la pantalla de verificación de correo electrónico tras el registro.
 * - Mostrar mensajes de éxito o error según el resultado de la operación.
 *
 * 👉 Este hook centraliza la lógica del formulario, haciendo el componente de UI más limpio,
 * reutilizable y fácil de mantener o testear.
 */

// hooks/useProviderRegistrationForm.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth.service.js';

const useProviderRegistrationForm = () => {

  // Hook de navegación de React Router para redirigir tras el registro exitoso.
  const navigate = useNavigate();

  // Estado principal del formulario.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    lastname: '',
    role: 'provider',  // Rol predeterminado: proveedor.
  });
  const [loading, setLoading] = useState(false);     // Indica si se está procesando el registro.
  const [errors, setErrors] = useState('');         // Almacena mensajes de error.
  const [successMessage, setSuccessMessage] = useState(''); // Mensaje de confirmación exitosa.

    /**
   * handleChange
   * Maneja los cambios en los inputs del formulario.
   * Actualiza dinámicamente el estado `formData` según el campo modificado.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  /**
   * handleSubmit
   * Maneja el envío del formulario:
   * - Valida que las contraseñas coincidan.
   * - Envía los datos al servicio de autenticación (`registerUser`).
   * - Gestiona la respuesta, mostrando mensajes y redirigiendo al usuario.
   */  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors('');
    setSuccessMessage('');

    // Validación básica: coincidencia de contraseñas.
    if (formData.password !== formData.confirmPassword) {
      setErrors('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    
    // Excluye el campo confirmPassword antes de enviar.
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

  // Retorna todas las propiedades y funciones necesarias para el formulario.
  return {
    formData,         // Datos del formulario.
    handleChange,     // Manejo de cambios en los inputs.
    handleSubmit,     // Lógica de envío del formulario.
    loading,          // Estado de carga.
    errors,           // Mensaje de error.
    successMessage,   // Mensaje de éxito.
  };
};

export default useProviderRegistrationForm;


