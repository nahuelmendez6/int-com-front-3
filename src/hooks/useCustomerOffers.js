
// Importa los hooks necesarios de React:
// - useState: para manejar los estados locales (ofertas, carga, errores).
// - useEffect: para ejecutar la carga de datos cuando cambian las dependencias.
import { useState, useEffect } from 'react';

// Importa la función del servicio de ofertas que obtiene las ofertas personalizadas
// para un cliente autenticado.
import { getCustomerFeedOffers } from '../services/offers.service';


// Hook personalizado: useCustomerOffers
// Este hook gestiona la obtención de ofertas disponibles para un usuario con rol de "customer".
// Se encarga de controlar los estados de carga, error y los datos obtenidos de la API.
export const useCustomerOffers = (profile, authLoading) => {

    // Lista de ofertas disponibles para el cliente autenticado.
    const [offers, setOffers] = useState([]);

    // Estado que indica si se está cargando la información.
    const [loading, setLoading] = useState(true);

    // Estado que almacena el mensaje de error si ocurre algún fallo en la carga.
    const [error, setError] = useState(null);

     // Efecto que se ejecuta cuando cambia el perfil del usuario o el estado de autenticación.
    // Su objetivo es cargar las ofertas personalizadas del cliente una vez que el perfil esté disponible.
    useEffect(() => {
            // Función asincrónica que obtiene las ofertas desde la API.    
            const fetchOffers = async () => {
            // Si el usuario no está definido o no tiene el rol de "customer", no se realiza la petición.
            if (!profile || profile.role !== 'customer') {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Llamada al servicio que obtiene las ofertas del feed para el cliente.
                const { data } = await getCustomerFeedOffers();
                // Actualiza el estado con las ofertas recibidas.
                setOffers(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching customer offers:', err);
                setError('Error al cargar las ofertas para clientes.');
            } finally {
                setLoading(false);
            }
            };
            // Solo ejecuta la carga cuando el proceso de autenticación ya terminó.
            if (!authLoading) fetchOffers();
    }, [profile, authLoading]);
    // Retorna los estados y datos necesarios para los componentes que usen este hook.
    return { offers, loading, error };

}