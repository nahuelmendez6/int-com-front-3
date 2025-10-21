import React, { useState } from 'react';
import { Card, ListGroup, Button, Spinner } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth.js';
import { useProviderServiceArea } from '../../hooks/useProviderServiceArea.js';
import ServiceAreaForm from './ServiceAreaForm.jsx';
import ConfirmationModal from '../common/ConfirmationModal.jsx';

const ProviderServiceArea = ({ providerId }) => {
  const { token, profile } = useAuth();
  const id_provider = profile?.profile?.id_provider;
  const [editMode, setEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);

  const {
    serviceArea,
    loading,
    error,
    deletingCity,
    provinces,
    departments,
    cities,
    formData,
    fetchServiceArea,
    deleteCity,
    loadProvinces,
    handleProvinceChange,
    handleDepartmentCheckbox,
    handleCityCheckbox,
    submitChanges,
  } = useProviderServiceArea({ token, providerId, id_provider });

  const handleEdit = async () => {
    await loadProvinces();
    setEditMode(true);
  };

  const handleDeleteClick = (cityId) => {
    setCityToDelete(cityId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    await deleteCity(cityToDelete);
    setCityToDelete(null);
    setShowConfirm(false);
  };

  if (loading) return <p>Cargando área de servicio...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Card.Title>Ciudades de Cobertura</Card.Title>
            {!editMode && (
              <Button variant="secondary" size="sm" onClick={handleEdit}>
                Editar
              </Button>
            )}
          </div>

          {serviceArea.length > 0 ? (
            <ListGroup variant="flush">
              {serviceArea.map(city => (
                <ListGroup.Item key={city.id_city} className="d-flex justify-content-between align-items-center">
                  {city.name}
                  {editMode && (
                    <Button
                      variant="link"
                      className="text-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(city.id_city)}
                      disabled={deletingCity === city.id_city}
                    >
                      {deletingCity === city.id_city
                        ? <Spinner as="span" animation="border" size="sm" />
                        : <FaTrash />}
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
                handleProvinceChange={e => handleProvinceChange(e.target.value)}
                handleDepartmentCheckbox={e => handleDepartmentCheckbox(e.target.value, e.target.checked)}
                handleCityCheckbox={e => handleCityCheckbox(e.target.value, e.target.checked)}
                handleSubmit={e => { e.preventDefault(); submitChanges(); setEditMode(false); }}
                onCancel={() => setEditMode(false)}
              />
            </div>
          )}
        </Card.Body>
      </Card>

      <ConfirmationModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        body="¿Estás seguro de eliminar esta ciudad de tu área de servicio?"
      />
    </>
  );
};

export default ProviderServiceArea;
