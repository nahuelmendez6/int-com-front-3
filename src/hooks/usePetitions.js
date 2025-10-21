import { useState, useEffect, useCallback } from 'react';
import { getPetitions, getProviderFeedPetitions } from '../services/petitions.service.js';
import { getUserProfile } from '../services/profile.service.js';

export const usePetitions = (profile) => {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPetitions = useCallback(async () => {
    if (!profile) return;

    setLoading(true);
    setError(null);

    try {
      if (profile.role === 'customer') {
        // Peticiones del customer
        const data = await getPetitions(profile.id_customer);
        setPetitions(data || []);
      } else if (profile.role === 'provider') {
        // Feed de peticiones para el provider
        const data = await getProviderFeedPetitions();
        if (!data || data.length === 0) {
          setPetitions([]);
          return;
        }

        // Cargar información de los clientes
        const uniqueCustomerIds = [...new Set(data.map(p => p.id_customer))];
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

        const enrichedPetitions = data.map(p => ({
          ...p,
          customer_user: customerMap[p.id_customer] || null,
        }));

        setPetitions(enrichedPetitions);
      } else {
        setPetitions([]);
      }
    } catch (err) {
      console.error('Error fetching petitions:', err);
      setError('Error al cargar las peticiones.');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchPetitions();
  }, [fetchPetitions]);

  return { petitions, loading, error, refetch: fetchPetitions };
};
