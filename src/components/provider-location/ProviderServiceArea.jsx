import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button, Spinner } from 'react-bootstrap';
import { getProviderArea, removeCityFromProviderArea } from '../../services/location.service.js';
import { FaTrash } from 'react-icons/fa';
import ConfirmationModal from '../common/ConfirmationModal.jsx';

const ProviderServiceArea = ({ providerId, onEdit, onUpdate }) => {
    const [serviceArea, setServiceArea] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingCity, setDeletingCity] = useState(null);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [cityToDelete, setCityToDelete] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchServiceArea = async () => {
            if (!providerId) return;
            try {
                setLoading(true);
                const areaData = await getProviderArea(providerId, signal);
                setServiceArea(areaData);
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

        fetchServiceArea();

        return () => {
            controller.abort();
        };
    }, [providerId]);

    const handleDeleteClick = (cityId) => {
        setCityToDelete(cityId);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!cityToDelete) return;

        try {
            setDeletingCity(cityToDelete);
            const token = localStorage.getItem('token');
            await removeCityFromProviderArea(token, providerId, cityToDelete);
            if (onUpdate) {
                onUpdate();
            }
            fetchServiceArea();
        } catch (err) {
            console.error('Error deleting city:', err);
        } finally {
            setDeletingCity(null);
            setShowConfirmModal(false);
            setCityToDelete(null);
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
                        <Button variant="secondary" size="sm" onClick={onEdit}>
                            Editar
                        </Button>
                    </div>
                    {serviceArea.length > 0 ? (
                        <ListGroup variant="flush">
                            {serviceArea.map((city) => (
                                <ListGroup.Item key={city.id_city} className="d-flex justify-content-between align-items-center">
                                    {city.name}
                                    <Button variant="link" className="text-danger" size="sm" onClick={() => handleDeleteClick(city.id_city)} disabled={deletingCity === city.id_city}>
                                        {deletingCity === city.id_city ? <Spinner as="span" animation="border" size="sm" /> : <FaTrash />}
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>No se ha definido un área de servicio.</p>
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