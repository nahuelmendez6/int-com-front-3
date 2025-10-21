import { useState, useEffect } from 'react';
import gradesService from '../services/grades.service';

const useAverageRating = (providerId) => {
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAverageRating = async () => {
      if (!providerId) return;

      try {
        setLoading(true);
        const data = await gradesService.getAverageRatingByProvider(providerId);
        setAverageRating(data.avg_rating);
      } catch (err) {
        setError('No se pudo cargar la calificación promedio.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAverageRating();
  }, [providerId]);

  return { averageRating, loading, error };
};

export default useAverageRating;
