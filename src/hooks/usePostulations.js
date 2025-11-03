// Importa los hooks necesarios de React.
import { useState, useCallback } from "react";

// Importa los servicios que interactúan con la API.
import { getPostulationsByPetition, updatePostulation } from "../services/postulation.service.js";
import { getUserProfile } from "../services/profile.service.js";



// Hook personalizado: usePostulations
// Este hook gestiona la carga, visualización y actualización de postulaciones
// asociadas a una petición (petition) dentro del sistema.
export const usePostulations = () => {
  // Lista de postulaciones activas (no eliminadas).
  const [postulations, setPostulations] = useState([]);

  // ID de la petición actualmente visible (si se están mostrando sus postulaciones).
  const [visiblePetition, setVisiblePetition] = useState(null);

  // Estado de carga mientras se obtienen o actualizan datos.
  const [loading, setLoading] = useState(false);

  // Estado de error para manejar fallas en las operaciones.
  const [error, setError] = useState(null);

  // Función: fetchPostulations
  // Carga todas las postulaciones activas de una petición específica
  // y las enriquece con los datos del usuario proveedor correspondiente.
  const fetchPostulations = useCallback(async (petitionId) => {
    setLoading(true);
    setError(null);
    try {
      // Obtiene las postulaciones desde el servicio.
      const data = await getPostulationsByPetition(petitionId);

      // Filtra las que no están marcadas como eliminadas (soft delete).
      const activePostulations = data.filter(p => !p.is_deleted); 

      // Si no hay postulaciones activas, vacía el estado y sale.
      if (!activePostulations || activePostulations.length === 0) {
        setPostulations([]);
        return;
      }

      // Obtiene los IDs únicos de los proveedores.
      const uniqueProviderIds = [...new Set(activePostulations.map((p) => p.id_provider))];

      // Mapa para relacionar ID de proveedor con sus datos de usuario.
      const providerMap = {};

      // Carga en paralelo la información de cada proveedor.
      await Promise.all(
        uniqueProviderIds.map(async (id_provider) => {
          try {
            const userData = await getUserProfile({ id_provider });
            providerMap[id_provider] = userData;
          } catch (err) {
            console.warn(`No se pudo cargar el usuario del proveedor ${id_provider}:`, err);
          }
        })
      );

      // Combina los datos de las postulaciones con la información del usuario proveedor.
      const enrichedPostulations = activePostulations.map((p) => ({
        ...p,
        provider_user: providerMap[p.id_provider] || null,
      }));

      // Guarda las postulaciones en el estado.
      setPostulations(enrichedPostulations);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las postulaciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Función: togglePostulations
  // Alterna la visibilidad de las postulaciones para una petición dada.
  // Si la petición ya está visible, la oculta; de lo contrario, la carga.
  const togglePostulations = useCallback(async (petitionId) => {
    if (visiblePetition === petitionId) {
      setVisiblePetition(null);
    } else {
      setVisiblePetition(petitionId);
      await fetchPostulations(petitionId);
    }
  }, [visiblePetition, fetchPostulations]);

  // Función: handleUpdatePostulation
  // Actualiza el estado de una postulación en el backend
  // y sincroniza el cambio en el estado local.
  const handleUpdatePostulation = async (postulationId, newState, petitionId) => {
    if (!petitionId) {
      console.error("Error: petitionId no fue proporcionado para la actualización.");
      return;
    }

    try {
      await updatePostulation(postulationId, { 
        id_state: newState,
        id_petition: petitionId
      });
      
      setPostulations(currentPostulations =>
        currentPostulations.map(p =>
          p.id_postulation === postulationId ? { ...p, id_state: newState } : p
        )
      );
    } catch (err) {
      console.error("Error al actualizar la postulación:", err);
    }
  };

    // Retorna todos los datos y funciones del hook.
  return {
    postulations,            // Lista de postulaciones activas.
    visiblePetition,         // ID de la petición actualmente visible.
    loading,                 // Estado de carga.
    error,                   // Mensaje de error, si existe.
    togglePostulations,      // Función para mostrar/ocultar postulaciones.
    handleUpdatePostulation, // Función para actualizar el estado de una postulación.
  };
};
