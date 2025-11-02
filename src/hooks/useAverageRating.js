// Importa los hooks de React necesarios:
// - useState: para manejar estados locales (calificación, carga, error).
// - useEffect: para ejecutar una acción (petición al servidor) cuando cambia el providerId.
import { useState, useEffect } from 'react';


// Importa el servicio que contiene las funciones de comunicación con la API relacionadas con calificaciones.
import gradesService from '../services/grades.service';


// Hook personalizado: useAverageRating
// Este hook obtiene y gestiona la calificación promedio de un proveedor específico.
// Permite a los componentes consumir los datos de forma sencilla, manejando automáticamente
// los estados de carga y error.
const useAverageRating = (providerId) => {
  // Estado que almacena la calificación promedio del proveedor.
  const [averageRating, setAverageRating] = useState(null);
  // Estado que indica si la información se está cargando.
  const [loading, setLoading] = useState(true);
  // Estado para manejar posibles errores durante la solicitud.
  const [error, setError] = useState(null);

  // Efecto que se ejecuta cada vez que cambia el providerId.
  // Si hay un providerId válido, se realiza la solicitud para obtener la calificación promedio.
  useEffect(() => {
    const fetchAverageRating = async () => {
      // Si no se proporciona un providerId, no realiza la petición.
      if (!providerId) return;

      try {
        setLoading(true); // Activa el estado de carga.

        // Llama al servicio para obtener la calificación promedio del proveedor.
        const data = await gradesService.getAverageRatingByProvider(providerId);
        
        // Actualiza el estado con la calificación recibida.
        setAverageRating(data.avg_rating);
      } catch (err) {
        
        // Si ocurre un error en la petición, guarda un mensaje descriptivo y lo muestra en consola.
        setError('No se pudo cargar la calificación promedio.');
        console.error(err);
      } finally {
        // Desactiva el estado de carga al finalizar la operación (éxito o error).
        setLoading(false);
      }
    };
    // Ejecuta la función definida al montar el componente o cuando cambie el providerId.
    fetchAverageRating();
  }, [providerId]);
  // Retorna un objeto con los valores y estados del hook.
  // Permite a los componentes consumidores mostrar datos o manejar errores fácilmente.
  return { averageRating, loading, error };
};
// Exporta el hook para que pueda ser utilizado en otros componentes.
export default useAverageRating;
