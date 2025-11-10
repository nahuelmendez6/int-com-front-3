// Importa los hooks de React necesarios:
// - useState: para manejar estados locales (calificación, carga, error).
// - useEffect: para ejecutar una acción (petición al servidor) cuando cambia el providerId.
import { useState, useEffect } from 'react';


// Importa el servicio que contiene las funciones de comunicación con la API relacionadas con calificaciones.
import gradesService from '../services/grades.service';


// Hook personalizado: useAverageRating
// Este hook obtiene y gestiona la calificación promedio de un usuario específico (proveedor o cliente).
// Permite a los componentes consumir los datos de forma sencilla, manejando automáticamente
// los estados de carga y error.
// @param {number|string} userId - ID del usuario (id_user). Puede ser null/undefined.
const useAverageRating = (userId) => {
  // Estado que almacena la calificación promedio del usuario.
  const [averageRating, setAverageRating] = useState(null);
  // Estado que indica si la información se está cargando.
  const [loading, setLoading] = useState(true);
  // Estado para manejar posibles errores durante la solicitud.
  const [error, setError] = useState(null);

  // Efecto que se ejecuta cada vez que cambia el userId.
  // Si hay un userId válido, se realiza la solicitud para obtener la calificación promedio.
  useEffect(() => {
    const fetchAverageRating = async () => {
      // Si no se proporciona un userId, no realiza la petición.
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Activa el estado de carga.

        // Llama al servicio para obtener la calificación promedio por id_user.
        const data = await gradesService.getAverageRatingByUserId(userId);
        
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
    // Ejecuta la función definida al montar el componente o cuando cambie el userId.
    fetchAverageRating();
  }, [userId]);
  // Retorna un objeto con los valores y estados del hook.
  // Permite a los componentes consumidores mostrar datos o manejar errores fácilmente.
  return { averageRating, loading, error };
};
// Exporta el hook para que pueda ser utilizado en otros componentes.
export default useAverageRating;
