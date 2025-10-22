import { useState, useCallback } from "react";
import { getPostulationsByPetition, updatePostulation } from "../services/postulation.service.js";
import { getUserProfile } from "../services/profile.service.js";

export const usePostulations = () => {
  const [postulations, setPostulations] = useState([]);
  const [visiblePetition, setVisiblePetition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPostulations = useCallback(async (petitionId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPostulationsByPetition(petitionId);
      const activePostulations = data.filter(p => !p.is_deleted); // Filter out soft-deleted postulations

      if (!activePostulations || activePostulations.length === 0) {
        setPostulations([]);
        return;
      }

      const uniqueProviderIds = [...new Set(activePostulations.map((p) => p.id_provider))];
      const providerMap = {};
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

      const enrichedPostulations = activePostulations.map((p) => ({
        ...p,
        provider_user: providerMap[p.id_provider] || null,
      }));

      setPostulations(enrichedPostulations);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las postulaciones.");
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePostulations = useCallback(async (petitionId) => {
    if (visiblePetition === petitionId) {
      setVisiblePetition(null);
    } else {
      setVisiblePetition(petitionId);
      await fetchPostulations(petitionId);
    }
  }, [visiblePetition, fetchPostulations]);

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

  return { postulations, visiblePetition, loading, error, togglePostulations, handleUpdatePostulation };
};
