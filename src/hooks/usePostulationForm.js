import { useEffect, useState } from 'react';
import materialService from '../services/material.service.js';

export const usePostulationForm = (initialData, providerId, show) => {
  const [proposal, setProposal] = useState('');
  const [budgetItems, setBudgetItems] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  // Sincroniza datos iniciales
  useEffect(() => {
    if (initialData) {
      setProposal(initialData.proposal || '');
      setBudgetItems(initialData.budgets || []);
      setMaterials(initialData.materials || []);
    } else {
      setProposal('');
      setBudgetItems([]);
      setMaterials([]);
    }
  }, [initialData, show]);

  // Carga materiales del proveedor
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!providerId) return;
      try {
        setLoadingMaterials(true);
        const response = await materialService.getMaterials(providerId);
        setAvailableMaterials(response.data);
      } catch (error) {
        console.error('Error loading materials:', error);
      } finally {
        setLoadingMaterials(false);
      }
    };

    if (show && providerId) fetchMaterials();
  }, [show, providerId]);

  return {
    proposal,
    setProposal,
    budgetItems,
    setBudgetItems,
    materials,
    setMaterials,
    availableMaterials,
    loadingMaterials,
  };
};
