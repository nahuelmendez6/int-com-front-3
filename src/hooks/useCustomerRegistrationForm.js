
// Importa hooks de React para manejar estado local.
import { useState } from 'react';

// Importa useNavigate de React Router para redirigir al usuario tras el registro.
import { useNavigate } from 'react-router-dom';

// Importa la función que realiza la llamada al backend para registrar un usuario.
import { registerUser } from '../services/auth.service.js';


// Hook personalizado: useCustomerRegistrationForm
// Este hook maneja la lógica de un formulario de registro para clientes.
// Gestiona estados de inputs, validaciones, envío, errores y mensajes de éxito.
const useCustomerRegistrationForm = () => {

  // Hook para navegación programática después de un registro exitoso.
  const navigate = useNavigate();

  // Estado que almacena los datos del formulario.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    lastname: '',
    role: 'customer', // Rol fijo para el formulario de registro de clientes
  });
   // Estado de carga para deshabilitar inputs y mostrar spinner mientras se envía el formulario.
  const [loading, setLoading] = useState(false);

  // Estado para almacenar mensajes de error.
  const [errors, setErrors] = useState('');

  // Estado para almacenar mensaje de éxito.
  const [successMessage, setSuccessMessage] = useState('');

   // Maneja los cambios en los inputs del formulario.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja el envío del formulario.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors('');
    setSuccessMessage('');
     // Validación: las contraseñas deben coincidir.
    if (formData.password !== formData.confirmPassword) {
      setErrors('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
      // Separamos confirmPassword porque el backend no lo necesita.
    const { confirmPassword, ...dataToSend } = formData;

    try {
       // Llama al servicio que registra al usuario.
      await registerUser(dataToSend);
      // Mensaje de éxito y redirección a la página de verificación de email.
      setSuccessMessage('¡Registro exitoso!');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      console.error('Error en registro:', err);

      // Maneja distintos formatos de error y genera un mensaje para mostrar al usuario.
      const errorMsg =
        err.detail ||
        err.message ||
        (typeof err === 'string' ? err : 'Error al registrar usuario');
      setErrors(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  // Retorna todos los estados y funciones necesarios para el formulario.
  return {
    formData,        // Datos del formulario
    handleChange,    // Función para actualizar inputs
    handleSubmit,    // Función para enviar formulario
    loading,         // Estado de carga
    errors,          // Mensaje de error
    successMessage,  // Mensaje de éxito
  };
};

export default useCustomerRegistrationForm;
