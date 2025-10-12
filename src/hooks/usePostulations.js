import { useState } from "react";
import { getPostulationsByPetition } from "../services/postulation.service.js";
import { getUserProfile } from "../services/profile.service.js";

export const usePostulations = () => {
  const [postulations, setPostulations] = useState([]);
  const [visiblePetition, setVisiblePetition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const togglePostulations = async (petitionId) => {
    if (visiblePetition === petitionId) {
      // ocultar
      setVisiblePetition(null);
      return;
    }

    setLoading(true);
    setError(null);
    setPostulations([]);

    try {
      // 1️⃣ Obtener las postulaciones
      const data = await getPostulationsByPetition(petitionId);

      if (!data || data.length === 0) {
        setPostulations([]);
        setVisiblePetition(petitionId);
        return;
      }

      // 2️⃣ Obtener IDs únicos de proveedores
      const uniqueProviderIds = [...new Set(data.map((p) => p.id_provider))];

      // 3️⃣ Traer datos de usuario para cada proveedor (en paralelo)
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

      // 4️⃣ Enriquecer cada postulación con los datos del proveedor
      const enrichedPostulations = data.map((p) => ({
        ...p,
        provider_user: providerMap[p.id_provider] || null,
      }));

      setPostulations(enrichedPostulations);
      console.log("Enriched Postulations:", enrichedPostulations);
      setVisiblePetition(petitionId);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las postulaciones o los datos de los proveedores.");
    } finally {
      setLoading(false);
    }
  };

  return { postulations, visiblePetition, loading, error, togglePostulations };
};
