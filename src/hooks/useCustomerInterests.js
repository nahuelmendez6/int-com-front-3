
// Importa los hooks de React necesarios:
// - useState: para manejar estados locales (categorías, intereses, errores, etc.).
// - useEffect: para ejecutar acciones cuando el componente se monta o cambia el cliente.
// - useCallback: para memorizar funciones y evitar recrearlas innecesariamente.
import { useState, useEffect, useCallback } from 'react';


// Importa las funciones del servicio de intereses, que realizan las peticiones a la API:
// - getCategories: obtiene la lista de categorías disponibles.
// - getInterestsByCustomer: obtiene los intereses asociados a un cliente.
// - saveInterest: guarda un nuevo interés para el cliente.
// - deleteInterest: elimina un interés existente.
import { getCategories, getInterestsByCustomer, saveInterest, deleteInterest } 
from '../services/interest.service.js';


// Hook personalizado: useCustomerInterests
// Este hook gestiona el conjunto de intereses de un cliente (sus categorías, intereses, etc.)
// incluyendo las operaciones de lectura, creación y eliminación.
export const useCustomerInterests = (customerId) => {
  // Lista de categorías disponibles.
  const [categories, setCategories] = useState([]);

  // Lista de intereses actuales del cliente.
  const [interests, setInterests] = useState([]);

    // Mapa auxiliar que relaciona el ID de la categoría con su nombre,
  // útil para mostrar etiquetas o nombres descriptivos en la interfaz.
  const [categoryMap, setCategoryMap] = useState(new Map());

  // Estado que indica si los datos están cargando.
  const [loading, setLoading] = useState(true);

  // Estado que guarda un mensaje de error si ocurre un problema con la API.
  const [error, setError] = useState(null);


  // Función para obtener las categorías e intereses del cliente.
  // Se memoiza con useCallback para no recrearla en cada renderizado.
  const fetchData = useCallback(async () => {
    if (!customerId) return;

    setLoading(true);
    setError(null);

    try {
      const [categoriesResponse, interestsResponse] = await Promise.all([
        getCategories(),
        getInterestsByCustomer(customerId)
      ]);

      const cats = categoriesResponse.data || [];
      const ints = interestsResponse.data || [];

      setCategories(cats);
      setInterests(ints);
      setCategoryMap(new Map(cats.map(c => [c.id_category, c.name])));
    } catch (err) {
      console.error('Error fetching interests data:', err);
      setError('Error al cargar categorías o intereses.');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addInterest = async (categoryId) => {
    if (!customerId) return;

    try {
      const response = await saveInterest(customerId, categoryId);
      setInterests(prev => [...prev, response.data]);
    } catch (err) {
      console.error('Error adding interest:', err);
      setError('Error al añadir el interés.');
    }
  };

  const removeInterest = async (interestId) => {
    try {
      await deleteInterest(interestId);
      setInterests(prev => prev.filter(i => i.id_interest !== interestId));
    } catch (err) {
      console.error('Error deleting interest:', err);
      setError('Error al eliminar el interés.');
    }
  };

  // Retorna todos los datos y funciones necesarias para que los componentes consumidores
  // puedan acceder y manipular los intereses del cliente.  
  return {
    categories, // Lista de categorías disponibles
    interests,   // Lista de intereses del cliente
    categoryMap,  // Mapa auxiliar (id → nombre de categoría)
    loading,      // Indicador de carga
    error,        // Mensaje de error, si existe
    addInterest,  // Función para añadir un interés
    removeInterest, // Función para eliminar un interés
    refetch: fetchData, // Permite recargar los datos manualmente
  };
};
