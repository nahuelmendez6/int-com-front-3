import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostulationForm from '../components/postulations/PostulationForm';
import { createPostulation } from '../services/postulation.service.js';
import { useAuth } from '../hooks/useAuth';

/**
 * @function PostulationPage
 * @description Componente principal para gestionar la creación de una nueva postulación
 * (oferta de servicio) a una petición específica.
 * Obtiene el ID de la petición de la URL y maneja el estado del formulario, la
 * lógica de envío (submission) y los posibles errores.
 * @returns {JSX.Element} El contenedor de la página que renderiza el formulario de postulación.
 */
const PostulationPage = () => {

  // 1. Hooks y Contexto
  
  // Obtiene el 'id' de la petición de los parámetros de la URL (e.g., /postulate/:id).
  const { id } = useParams();

  // Hook para la navegación programática (redirecciones).
  const navigate = useNavigate();

  // Obtiene la información del perfil del usuario logueado, crucial para el ID del proveedor.
  const { profile } = useAuth();

  // 2. Estados Locales
  
  // Estado para manejar y mostrar cualquier mensaje de error.
  const [error, setError] = useState(null);

  // Estado booleano para deshabilitar el formulario mientras se envía la petición (UX).
  const [submitting, setSubmitting] = useState(false);

  // Estado para controlar la visibilidad del formulario (usado como modal o página que cierra).
  const [showForm, setShowForm] = useState(true);

  // 3. Handlers
  
  /**
   * @function handleCloseForm
   * @description Cierra el formulario y navega de vuelta a la página anterior.
   */
  const handleCloseForm = () => {
    setShowForm(false);
    navigate(-1); // Vuelve a la URL de donde vino el usuario.
  };

  /**
   * @async
   * @function handleSubmit
   * @description Maneja el envío de datos del formulario de postulación.
   * Valida, prepara los datos y llama al servicio de creación de postulación.
   * @param {object} formData - Datos del formulario (propuesta, presupuestos, materiales).
   */
  const handleSubmit = async (formData) => {

    // Validación inicial: asegurar que el ID del proveedor está disponible.
    if (!profile || !profile.profile || !profile.profile.id_provider) {
      setError('No se pudo obtener el ID del proveedor. Asegúrese de haber iniciado sesión.');
      return;
    }

    // Preparación de los datos para el servicio de creación (API Payload).
    const postulationData = {
      id_petition: parseInt(id, 10), // Convierte el ID de la URL a entero.
      id_provider: profile.profile.id_provider,
      winner: false, // Por defecto, una nueva postulación no es ganadora.
      proposal: formData.proposal,
      id_state: 1, // Asume que '1' es el estado inicial (e.g., 'Enviada').
      budgets: formData.budgets,
      materials: formData.materials,
    };

    try {
      setSubmitting(true);
      setError(null);
      await createPostulation(postulationData);
      handleCloseForm();
    } catch (err) {
      setError('Error al crear la postulación. Por favor, inténtelo de nuevo.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="postulation-page">
      {/* El componente PostulationForm (probablemente un Modal o un componente con diseño de Modal) 
        es renderizado y se le pasan todos los estados y handlers necesarios para su funcionamiento.
      */}
      <PostulationForm
        show={showForm}
        handleClose={handleCloseForm}
        onSubmit={handleSubmit}
        error={error}
        submitting={submitting}
        providerId={profile?.profile?.id_provider}
      />
    </div>
  );
};

export default PostulationPage;