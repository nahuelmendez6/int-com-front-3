import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { getCategories, saveInterest, getInterestsByCustomer, deleteInterest } from '../services/interest.service.js';
import { useAuth } from '../hooks/useAuth';

const InterestsPage = () => {
  const [categories, setCategories] = useState([]);
  const [customerInterests, setCustomerInterests] = useState([]);
  const [categoryMap, setCategoryMap] = useState(new Map());
  const { profile } = useAuth();

  useEffect(() => {
    if (profile && profile.profile.id_customer) {
      Promise.all([
        getCategories(),
        getInterestsByCustomer(profile.profile.id_customer)
      ])
      .then(([categoriesResponse, interestsResponse]) => {
        const cats = categoriesResponse.data;
        setCategories(cats);
        setCustomerInterests(interestsResponse.data);
        setCategoryMap(new Map(cats.map(c => [c.id_category, c.name])));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  }, [profile]);

  const handleAddInterest = (categoryId) => {
    if (!profile || !profile.profile.id_customer) return;
    
    saveInterest(profile.profile.id_customer, categoryId)
      .then(response => {
        // Add the new interest to the local state to update the UI instantly
        setCustomerInterests(prevInterests => [...prevInterests, response.data]);
      })
      .catch(error => {
        console.error('Error adding interest:', error);
        alert('Hubo un error al añadir el interés.');
      });
  };

  const handleDeleteInterest = (interestId) => {
    deleteInterest(interestId)
      .then(() => {
        // Remove the interest from the local state to update the UI instantly
        setCustomerInterests(prevInterests => prevInterests.filter(interest => interest.id_interest !== interestId));
      })
      .catch(error => {
        console.error('Error deleting interest:', error);
        alert('Hubo un error al eliminar el interés.');
      });
  };

  const selectedCategoryIds = new Set(customerInterests.map(i => i.id_category));
  const availableCategories = categories.filter(c => !selectedCategoryIds.has(c.id_category));

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <Sidebar />
      <div 
        className="container-fluid"
        style={{
          paddingTop: '80px',
          paddingLeft: '290px',
          paddingRight: '20px',
          width: '100%',
          maxWidth: 'none'
        }}
      >
        <div className="card shadow rounded-3">
          <div className="card-body p-4">
            <h1>Gestiona tus Intereses</h1>
            <p>Añade o elimina categorías de servicios para personalizar tu experiencia. Los cambios se guardan automáticamente.</p>
            
            <hr />

            <h4>Mis Intereses</h4>
            <div className="d-flex flex-wrap align-items-center mb-3">
              {customerInterests.length > 0 ? (
                customerInterests.map(interest => (
                  <span key={`selected-${interest.id_interest}`} className="badge bg-primary fs-6 me-2 mb-2 d-flex align-items-center">
                    {categoryMap.get(interest.id_category) || 'Cargando...'}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      aria-label="Remove"
                      onClick={() => handleDeleteInterest(interest.id_interest)}
                    ></button>
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
                      onChange={() => handleAddInterest(category.id_category)}
                    />
                    <label className="form-check-label" htmlFor={`category-${category.id_category}`}>
                      {category.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestsPage;
