import { useState, useEffect, useCallback } from 'react';
import { getProviderFeedPetitions } from '../services/petitions.service.js';
import { getUserProfile } from '../services/profile.service.js';

export const usePetitions = (profile) => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPetitions = useCallback(async () => {
    if (profile && profile.role === 'provider') {
      setLoading(true);
      setError(null);
      try {
        const data = await getProviderFeedPetitions();
        if (!data || data.length === 0) {
          setPetitions([]);
          return;
        }

        const uniqueCustomerIds = [...new Set(data.map((p) => p.id_customer))];
        const customerMap = {};
        await Promise.all(
          uniqueCustomerIds.map(async (id_customer) => {
            try {
              const userData = await getUserProfile({ id_customer });
              customerMap[id_customer] = userData;
            } catch (err) {
              console.warn(`No se pudo cargar el usuario del cliente ${id_customer}:`, err);
            }
          })
        );
        
        const enrichedPetitions = data.map((p) => ({
          ...p,
          customer_user: customerMap[p.id_customer] || null,
        }));
        console.log(enrichedPetitions)
        setPetitions(enrichedPetitions);
      } catch (err) {
        console.error("Error fetching provider petitions:", err);
        setError('Error al cargar las peticiones para proveedores.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchPetitions();
  }, [fetchPetitions]);

  return { petitions, loading, error };
};