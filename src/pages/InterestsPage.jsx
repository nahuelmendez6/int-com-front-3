import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCustomerInterests } from '../hooks/useCustomerInterests';

/**
 * @function InterestsPage
 * @description Componente de página que permite a un cliente gestionar sus categorías de interés.
 * Muestra las categorías seleccionadas actualmente y ofrece una lista de categorías disponibles
 * para añadir nuevos intereses. La lógica de gestión (carga, adición y eliminación) se maneja
 * a través del hook personalizado `useCustomerInterests`.
 * @returns {JSX.Element} La interfaz de usuario para la gestión de intereses.
 */
const InterestsPage = () => {
  
  // 1. Obtención del ID del Cliente
  const { profile } = useAuth();
  // Extrae el ID del cliente del perfil, esencial para el hook de intereses.
  const customerId = profile?.profile?.id_customer; 
  
  // 2. Uso del Hook de Lógica de Intereses
  const {
    categories,
    interests,
    categoryMap,
    loading,
    error,
    addInterest,
    removeInterest,
  } = useCustomerInterests(customerId);
  
  // 3. Lógica de Filtrado de Categorías
  
  // Crea un Set con los IDs de las categorías que ya son intereses.
  const selectedCategoryIds = new Set(interests.map(i => i.id_category));
  
  // Filtra la lista completa de categorías para obtener solo las que están disponibles para añadir.
  const availableCategories = categories.filter(c => !selectedCategoryIds.has(c.id_category));

  // 4. Renderizado Condicional: Carga
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
  
  // 5. Renderizado Condicional: Error
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
  
  // 6. Renderizado Principal
  return (
    <div className="interests-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          
          {/* Título de la Página */}
          <h1 className="card-title mb-4">
            <i className="bi bi-heart me-2"></i>
            Mis Intereses
          </h1>
          <p className="text-muted mb-4">
            Añade o elimina categorías de servicios para personalizar tu experiencia. Los cambios se guardan automáticamente.
          </p>
          
          <hr />
          
          {/* Sección de Intereses Seleccionados */}
          <h4>Mis Intereses</h4>
          <div className="d-flex flex-wrap align-items-center mb-3">
            {interests.length > 0 ? (
              // Mapeo de los intereses actuales como badges eliminables
              interests.map(interest => (
                <span
                  key={`selected-${interest.id_interest}`}
                  className="badge bg-primary fs-6 me-2 mb-2 d-flex align-items-center"
                >
                  {/* Usa el categoryMap para obtener el nombre de la categoría por ID */}
                  {categoryMap.get(interest.id_category) || 'Cargando...'}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    aria-label="Remove"
                    // Llama a removeInterest con el ID del interés para eliminarlo
                    onClick={() => removeInterest(interest.id_interest)}
                  />
                </span>
              ))
            ) : (
              <p className="text-muted">No has seleccionado ningún interés todavía.</p>
            )}
          </div>
          
          <hr />
          
          {/* Sección de Categorías Disponibles para Agregar */}
          <h4>Agregar Nuevos Intereses</h4>
          <div className="row mt-3">
            {/* Mapea solo las categorías que NO están seleccionadas */}
            {availableCategories.map(category => (
              <div key={category.id_category} className="col-md-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`category-${category.id_category}`}
                    value={category.id_category}
                    checked={false} // Siempre es false porque al hacer click se añade y desaparece
                    // Llama a addInterest con el ID de la categoría para crear un nuevo interés
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