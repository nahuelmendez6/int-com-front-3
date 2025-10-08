import React, { useState, useEffect } from 'react';
import { Button, Modal, Card, ListGroup } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { getProvinces, getDepartmentsByProvince, getCitiesByDepartment, updateProviderCities } from '../../services/location.service.js';
import { useAuth } from '../../hooks/useAuth.js';
import ServiceAreaForm from './ServiceAreaForm.jsx';

const ServiceAreaSection = ({ provider, onUpdate }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ serviceArea: { province: '', departments: [], cities: [] } });
  const [provinces, setProvinces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (provider?.cities) {
      setFormData(prev => ({
        ...prev,
        serviceArea: {
          ...prev.serviceArea,
          cities: provider.cities.map(c => c.id_city.toString())
        }
      }))
    }
  }, [provider])

  
  const handleShow = () => {
    getProvinces()
      .then(setProvinces)
      .catch(err => console.error('Error cargando provincias:', err));
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  // Al cambiar provincia: setear provincia, limpiar departamentos y ciudades, cargar departamentos
  const handleProvinceChange = async e => {
    const provinceId = e.target.value;
    setFormData(prev => ({
      ...prev,
      serviceArea: { province: provinceId, departments: [], cities: [] }
    }));
    setDepartments([]);
    setCities([]);

    if (provinceId) {
      try {
        const depts = await getDepartmentsByProvince(provinceId);
        setDepartments(depts);
      } catch (err) {
        console.error('Error cargando departamentos:', err);
      }
    }
  };

  const handleDepartmentCheckbox = async e => {
    const { value, checked } = e.target;
    const deptId = value;
    const currentDepts = formData.serviceArea.departments;

    const newDepts = checked
      ? [...currentDepts, deptId]
      : currentDepts.filter(d => d !== deptId);

    setFormData(prev => ({
      ...prev,
      serviceArea: { ...prev.serviceArea, departments: newDepts }
    }));

    if (newDepts.length > 0) {
      try {
        // Obtener ciudades para todos los departamentos seleccionados
        const cityResults = await Promise.all(
          newDepts.map(id => getCitiesByDepartment(id))
        );
        // Aplanar y eliminar duplicados (por id_city)
        const flatCities = cityResults.flat();
        const uniqueCitiesMap = new Map();
        flatCities.forEach(city => {
          if (!uniqueCitiesMap.has(city.id_city)) uniqueCitiesMap.set(city.id_city, city);
        });
        setCities(Array.from(uniqueCitiesMap.values()));
      } catch (err) {
        console.error('Error cargando ciudades:', err);
      }
    } else {
      setCities([]);
    }
  };

  // Marcar/desmarcar ciudad en formData
  const handleCityCheckbox = e => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newCities = checked
        ? [...prev.serviceArea.cities, value]
        : prev.serviceArea.cities.filter(c => c !== value);
      return {
        ...prev,
        serviceArea: { ...prev.serviceArea, cities: newCities }
      };
    });
  };

  // Al enviar el formulario: validar y enviar datos al backend
  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.serviceArea.cities.length === 0) {
      alert('Debe seleccionar al menos una ciudad.');
      return;
    }

    const cityPayload = formData.serviceArea.cities
      .filter(id => id && !isNaN(id))
      .map(cityId => ({
        provider: provider.id_provider,
        city: Number(cityId)
      }));


    try {
      console.log("Payload a enviar:", cityPayload);

      await updateProviderCities(token, cityPayload);
      onUpdate();
      handleClose();
    } catch (error) {
      console.error('Error updating service areas:', error.response?.data || error);
      console.error('Error updating service areas:', error);
      alert('Error al actualizar las áreas de servicio. Intente nuevamente.');
    }
  };

  return (
    <div className="service-area-section mt-4">
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Áreas de Servicio</Card.Title>
            <Button variant="light" onClick={handleShow} className="edit-button">
              <FiEdit />
            </Button>
          </div>
          <ListGroup variant="flush">
            {provider?.cities?.map(city => (
              <ListGroup.Item key={city.id_city}>
                {city.name}, {city.department.province.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Áreas de Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ServiceAreaForm
            formData={formData}
            provinces={provinces}
            departments={departments}
            cities={cities}
            handleProvinceChange={handleProvinceChange}
            handleDepartmentCheckbox={handleDepartmentCheckbox}
            handleCityCheckbox={handleCityCheckbox}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServiceAreaSection;
