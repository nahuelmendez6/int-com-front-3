import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCustomerInterests } from '../hooks/useCustomerInterests';

const InterestsPage = () => {
  const { profile } = useAuth();
  const customerId = profile?.profile?.id_customer;

  const {
    categories,
    interests,
    categoryMap,
    loading,
    error,
    addInterest,
    removeInterest,
  } = useCustomerInterests(customerId);

  const selectedCategoryIds = new Set(interests.map(i => i.id_category));
  const availableCategories = categories.filter(c => !selectedCategoryIds.has(c.id_category));

  if (loading) {
    return (
      <div className="interests-page">
        <div className="card shadow rounded-3">
          <div className="card-body p-4">
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando intereses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interests-page">
        <div className="card shadow rounded-3">
          <div className="card-body p-4">
            <div className="alert alert-danger d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="interests-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          <h1 className="card-title mb-4">
            <i className="bi bi-heart me-2"></i>
            Mis Intereses
          </h1>
          <p className="text-muted mb-4">
            Añade o elimina categorías de servicios para personalizar tu experiencia. Los cambios se guardan automáticamente.
          </p>
          
          <hr />

          <h4>Mis Intereses</h4>
          <div className="d-flex flex-wrap align-items-center mb-3">
            {interests.length > 0 ? (
              interests.map(interest => (
                <span
                  key={`selected-${interest.id_interest}`}
                  className="badge bg-primary fs-6 me-2 mb-2 d-flex align-items-center"
                >
                  {categoryMap.get(interest.id_category) || 'Cargando...'}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    aria-label="Remove"
                    onClick={() => removeInterest(interest.id_interest)}
                  />
                </span>
              ))
            ) : (
              <p className="text-muted">No has seleccionado ningún interés todavía.</p>
            )}
          </div>

          <hr />

          <h4>Agregar Nuevos Intereses</h4>
          <div className="row mt-3">
            {availableCategories.map(category => (
              <div key={category.id_category} className="col-md-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`category-${category.id_category}`}
                    value={category.id_category}
                    checked={false}
                    onChange={() => addInterest(category.id_category)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`category-${category.id_category}`}
                  >
                    {category.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestsPage;
