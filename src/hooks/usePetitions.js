// Importa hooks de React para manejar estado, efectos y funciones memoizadas.
import { useState, useEffect, useCallback } from 'react';


// Importa funciones del servicio de peticiones (petitions).
import { getPetitions, getProviderFeedPetitions } from '../services/petitions.service.js';

// Importa servicio para obtener información de perfiles de usuario.
import { getUserProfile } from '../services/profile.service.js';


// Hook personalizado: usePetitions
// Este hook gestiona la carga y manejo de peticiones (solicitudes) según el rol del usuario.
// Si el usuario es "customer", carga sus propias peticiones.
// Si es "provider", carga un feed de peticiones disponibles para ofrecer servicios.
export const usePetitions = (profile) => {

  // Lista de peticiones obtenidas.
  const [petitions, setPetitions] = useState([]);

  // Estado de carga (true mientras se están obteniendo datos).
  const [loading, setLoading] = useState(true);

  // Mensaje de error, si ocurre algún problema al cargar.
  const [error, setError] = useState(null);

  // Función principal: obtener peticiones del usuario según su rol.
  const fetchPetitions = useCallback(async () => {

    // Si el perfil no existe, no hace nada.
    if (!profile) return;

    setLoading(true);
    setError(null);

    try {

      // Si el usuario es un "customer" (cliente)
      if (profile.role === 'customer') {
        
        // Obtiene las peticiones asociadas al cliente.
        const data = await getPetitions(profile.id_customer);
        setPetitions(data || []);

        // Si el usuario es un "provider" (proveedor)
      } else if (profile.role === 'provider') {
        // Obtiene el feed general de peticiones abiertas para proveedores.
        const data = await getProviderFeedPetitions();

         // Si no hay datos, se limpia la lista y se detiene el proceso.
        if (!data || data.length === 0) {
          setPetitions([]);
          return;
        }

        // Extrae los IDs únicos de los clientes para no hacer llamadas repetidas.
        const uniqueCustomerIds = [...new Set(data.map(p => p.id_customer))];

        // Mapa para almacenar la información de cada cliente.
        const customerMap = {};

        // Carga la información de los usuarios (clientes) de forma paralela.
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

         // Enriquecer cada petición con los datos del cliente correspondiente.
        const enrichedPetitions = data.map(p => ({
          ...p,
          customer_user: customerMap[p.id_customer] || null,
        }));

        setPetitions(enrichedPetitions);

        // Si el rol no es reconocido, no muestra nada.
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

  // Ejecutar carga inicial cada vez que cambia el perfil.
  useEffect(() => {
    fetchPetitions();
  }, [fetchPetitions]);

  // Retorna los estados y una función refetch para volver a cargar manualmente.
  return { petitions, loading, error, refetch: fetchPetitions };
};
