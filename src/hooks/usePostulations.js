import { useState } from 'react';
import { getPostulationsByPetition } from '../services/postulation.service.js';

export const usePostulations = () => {
  const [postulations, setPostulations] = useState([]);
  const [visiblePetition, setVisiblePetition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const togglePostulations = async (petitionId) => {
    if (visiblePetition === petitionId) {
      setVisiblePetition(null);
      return;
    }

    setLoading(true);
    setError(null);
    setPostulations([]);

    try {
      const data = await getPostulationsByPetition(petitionId);
      setPostulations(data);
      setVisiblePetition(petitionId);
    } catch {
      setError("No se pudieron cargar las postulaciones.");
    } finally {
      setLoading(false);
    }
  };

  return { postulations, visiblePetition, loading, error, togglePostulations };
};