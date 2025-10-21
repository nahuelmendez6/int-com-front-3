// src/hooks/useProviderServiceArea.js
import { useState, useEffect } from 'react';
import {
  getProviderArea,
  removeCityFromProviderArea,
  getProvinces,
  getDepartmentsByProvince,
  getCitiesByDepartment,
  updateProviderCities,
} from '../services/location.service.js';

export function useProviderServiceArea({ token, providerId, id_provider }) {
  const [serviceArea, setServiceArea] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingCity, setDeletingCity] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    serviceArea: { province: '', departments: [], cities: [] },
  });

  // Cargar área actual
  const fetchServiceArea = async () => {
    if (!providerId) return;
    try {
      setLoading(true);
      const area = await getProviderArea(providerId);
      setServiceArea(area);
      setFormData(prev => ({
        ...prev,
        serviceArea: { ...prev.serviceArea, cities: area.map(c => c.id_city.toString()) },
      }));
      setError(null);
    } catch (err) {
      setError('Error al cargar el área de servicio.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceArea();
  }, [providerId]);

  // Eliminar ciudad
  const deleteCity = async (cityId) => {
    try {
      setDeletingCity(cityId);
      await removeCityFromProviderArea(token, providerId, cityId);
      await fetchServiceArea();
    } catch (err) {
      console.error('Error eliminando ciudad:', err);
    } finally {
      setDeletingCity(null);
    }
  };

  // Cargar provincias/departamentos/ciudades
  const loadProvinces = async () => {
    const data = await getProvinces();
    setProvinces(data);
  };

  const handleProvinceChange = async (provinceId) => {
    setFormData(prev => ({
      ...prev,
      serviceArea: { province: provinceId, departments: [], cities: prev.serviceArea.cities },
    }));
    setDepartments([]);
    setCities([]);

    if (!provinceId) return;
    try {
      const depts = await getDepartmentsByProvince(provinceId);
      setDepartments(depts);
    } catch (err) {
      console.error('Error cargando departamentos:', err);
    }
  };

  const handleDepartmentCheckbox = async (deptId, checked) => {
    const currentDepts = formData.serviceArea.departments;
    const newDepts = checked
      ? [...currentDepts, deptId]
      : currentDepts.filter(d => d !== deptId);

    setFormData(prev => ({
      ...prev,
      serviceArea: { ...prev.serviceArea, departments: newDepts },
    }));

    if (newDepts.length === 0) {
      setCities([]);
      return;
    }

    try {
      const cityResults = await Promise.all(newDepts.map(id => getCitiesByDepartment(id)));
      const uniqueCities = Array.from(
        new Map(cityResults.flat().map(c => [c.id_city, c])).values()
      );
      setCities(uniqueCities);
    } catch (err) {
      console.error('Error cargando ciudades:', err);
    }
  };

  const handleCityCheckbox = (cityId, checked) => {
    setFormData(prev => {
      const cities = checked
        ? [...prev.serviceArea.cities, cityId]
        : prev.serviceArea.cities.filter(c => c !== cityId);
      return { ...prev, serviceArea: { ...prev.serviceArea, cities } };
    });
  };

  const submitChanges = async () => {
    if (formData.serviceArea.cities.length === 0) {
      alert('Debe seleccionar al menos una ciudad.');
      return;
    }

    try {
      await updateProviderCities(token, {
        provider: id_provider,
        cities: formData.serviceArea.cities.map(Number),
      });
      await fetchServiceArea();
    } catch (error) {
      console.error('Error actualizando áreas:', error);
      alert('Error al actualizar. Intente nuevamente.');
    }
  };

  return {
    serviceArea,
    loading,
    error,
    deletingCity,
    provinces,
    departments,
    cities,
    formData,
    setFormData,
    fetchServiceArea,
    deleteCity,
    loadProvinces,
    handleProvinceChange,
    handleDepartmentCheckbox,
    handleCityCheckbox,
    submitChanges,
  };
}
