// Importa hooks de React para manejar estado y efectos secundarios.
import { useEffect, useState } from 'react';

// Importa el servicio que gestiona los materiales.
import materialService from '../services/material.service.js';


// Hook personalizado: usePostulationForm
// Este hook administra el formulario de postulación de un proveedor.
// Controla la propuesta, los presupuestos, los materiales seleccionados y los materiales disponibles.
export const usePostulationForm = (initialData, providerId, show) => {

  // Estado del texto de la propuesta.
  const [proposal, setProposal] = useState('');

  // Lista de ítems de presupuesto asociados a la postulación.
  const [budgetItems, setBudgetItems] = useState([]);

  // Lista de materiales seleccionados para esta postulación.
  const [materials, setMaterials] = useState([]);


  // Lista completa de materiales disponibles del proveedor.
  const [availableMaterials, setAvailableMaterials] = useState([]);

  // Estado de carga mientras se obtienen los materiales.
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  // Efecto: sincronizar los datos iniciales del formulario.
  // Cada vez que cambia `initialData` o se muestra el formulario (`show`),
  // se rellenan los campos con los valores existentes o se limpian.
  useEffect(() => {
    if (initialData) {
      // Cargar datos previos si existen (modo edición).
      setProposal(initialData.proposal || '');
      setBudgetItems(initialData.budgets || []);
      setMaterials(initialData.materials || []);
    } else {
       // Reiniciar si no hay datos iniciales.
      setProposal('');
      setBudgetItems([]);
      setMaterials([]);
    }
  }, [initialData, show]);


  // Efecto: cargar los materiales disponibles del proveedor.
  // Solo se ejecuta si el formulario está visible (`show === true`)
  // y existe un `providerId` válido.
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!providerId) return;
      try {
        setLoadingMaterials(true);

        // Solicita al backend los materiales asociados al proveedor.
        const response = await materialService.getMaterials(providerId);

        // Guarda los materiales disponibles en el estado local.
        setAvailableMaterials(response.data);
      } catch (error) {
        console.error('Error loading materials:', error);
      } finally {

        // Finaliza la carga en cualquier caso.
        setLoadingMaterials(false);
      }
    };
    // Ejecuta la carga solo si el formulario está visible y el proveedor existe.
    if (show && providerId) fetchMaterials();
  }, [show, providerId]);
  // Retorna todos los estados y funciones necesarios
  // para manejar el formulario de postulación.
  return {
    proposal,           // Texto de la propuesta.
    setProposal,        // Setter para modificar la propuesta.
    budgetItems,        // Lista de ítems de presupuesto.
    setBudgetItems,     // Setter para modificar los ítems del presupuesto.
    materials,          // Materiales seleccionados en la postulación.
    setMaterials,       // Setter para actualizar materiales seleccionados.
    availableMaterials, // Materiales disponibles del proveedor.
    loadingMaterials,   // Indicador de carga mientras se obtienen materiales.
  };
};
