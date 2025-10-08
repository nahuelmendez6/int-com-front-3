import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Spinner } from 'react-bootstrap';
import { getProviderArea, removeCityFromProviderArea, getProvinces, getDepartmentsByProvince, getCitiesByDepartment, updateProviderCities } from '../../services/location.service.js';
import { FaTrash } from 'react-icons/fa';
import ConfirmationModal from '../common/ConfirmationModal.jsx';
import ServiceAreaForm from './ServiceAreaForm.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const ProviderServiceArea = ({ providerId }) => {
    const { token, profile } = useAuth();
    const [serviceArea, setServiceArea] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingCity, setDeletingCity] = useState(null);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [cityToDelete, setCityToDelete] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({ serviceArea: { province: '', departments: [], cities: [] } });
    const [provinces, setProvinces] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [cities, setCities] = useState([]);

    const id_provider = profile?.profile?.id_provider;

    const fetchServiceArea = async () => {
        if (!providerId) return;
        try {
            setLoading(true);
            const areaData = await getProviderArea(providerId);
            setServiceArea(areaData);
            setFormData(prev => ({
                ...prev,
                serviceArea: {
                    ...prev.serviceArea,
                    cities: areaData.map(c => c.id_city.toString())
                }
            }))
            setError(null);
        } catch (err) {
            if (err.name !== 'CanceledError') {
                setError('Error al cargar el área de servicio.');
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceArea();
    }, [providerId]);

    const handleEdit = () => {
        getProvinces()
            .then(setProvinces)
            .catch(err => console.error('Error cargando provincias:', err));
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
    };

    const handleDeleteClick = (cityId) => {
        setCityToDelete(cityId);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!cityToDelete) return;

        try {
            setDeletingCity(cityToDelete);
            await removeCityFromProviderArea(token, providerId, cityToDelete);
            fetchServiceArea();
        } catch (err) {
            console.error('Error deleting city:', err);
        } finally {
            setDeletingCity(null);
            setShowConfirmModal(false);
            setCityToDelete(null);
        }
    };

    const handleProvinceChange = async e => {
        const provinceId = e.target.value;
        setFormData(prev => ({
            ...prev,
            serviceArea: { province: provinceId, departments: [], cities: prev.serviceArea.cities }
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
                const cityResults = await Promise.all(
                    newDepts.map(id => getCitiesByDepartment(id))
                );
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

    const handleSubmit = async e => {
        e.preventDefault();

        if (formData.serviceArea.cities.length === 0) {
            alert('Debe seleccionar al menos una ciudad.');
            return;
        }

        const cityPayload = formData.serviceArea.cities
            .filter(id => id && !isNaN(id))
            .map(cityId => ({
                provider: providerId,
                city: Number(cityId)
            }));

        try {
            console.log('esto se esta mandando',cityPayload);
            // await updateProviderCities(token, cityPayload);
            await updateProviderCities(token, {
                provider: id_provider,
                cities: formData.serviceArea.cities.map(Number)
            });

            fetchServiceArea();
            setEditMode(false);
        } catch (error) {
            console.error('Error updating service areas:', error.response?.data || error);
            alert('Error al actualizar las áreas de servicio. Intente nuevamente.');
        }
    };

    if (loading) {
        return <p>Cargando área de servicio...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Card.Title className="mb-0">Ciudades de Cobertura</Card.Title>
                        {!editMode && (
                            <Button variant="secondary" size="sm" onClick={handleEdit}>
                                Editar
                            </Button>
                        )}
                    </div>
                    {serviceArea.length > 0 ? (
                        <ListGroup variant="flush">
                            {serviceArea.map((city) => (
                                <ListGroup.Item key={city.id_city} className="d-flex justify-content-between align-items-center">
                                    {city.name}
                                    {editMode && (
                                        <Button variant="link" className="text-danger" size="sm" onClick={() => handleDeleteClick(city.id_city)} disabled={deletingCity === city.id_city}>
                                            {deletingCity === city.id_city ? <Spinner as="span" animation="border" size="sm" /> : <FaTrash />}
                                        </Button>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>No se ha definido un área de servicio.</p>
                    )}

                    {editMode && (
                        <div className="mt-4">
                            <ServiceAreaForm
                                formData={formData}
                                provinces={provinces}
                                departments={departments}
                                cities={cities}
                                handleProvinceChange={handleProvinceChange}
                                handleDepartmentCheckbox={handleDepartmentCheckbox}
                                handleCityCheckbox={handleCityCheckbox}
                                handleSubmit={handleSubmit}
                                onCancel={handleCancel}
                            />
                        </div>
                    )}
                </Card.Body>
            </Card>

            <ConfirmationModal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                onConfirm={confirmDelete}
                title="Confirmar Eliminación"
                body="¿Estás seguro de que quieres eliminar esta ciudad de tu área de servicio?"
            />
        </>
    );
};

export default ProviderServiceArea;
