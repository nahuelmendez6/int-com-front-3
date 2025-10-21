import { useState, useEffect, useCallback } from 'react';
import { getCategories, getInterestsByCustomer, saveInterest, deleteInterest } 
from '../services/interest.service.js';

export const useCustomerInterests = (customerId) => {
  const [categories, setCategories] = useState([]);
  const [interests, setInterests] = useState([]);
  const [categoryMap, setCategoryMap] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return {
    categories,
    interests,
    categoryMap,
    loading,
    error,
    addInterest,
    removeInterest,
    refetch: fetchData,
  };
};
