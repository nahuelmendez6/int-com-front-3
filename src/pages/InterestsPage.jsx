import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { getCategories, saveInterest, getInterestsByCustomer } from '../services/interest.service.js';
import { useAuth } from '../hooks/useAuth';

const InterestsPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const { profile } = useAuth();

  useEffect(() => {
    if (profile && profile.profile.id_customer) {
      Promise.all([
        getCategories(),
        getInterestsByCustomer(profile.profile.id_customer)
      ])
      .then(([categoriesResponse, interestsResponse]) => {
        setCategories(categoriesResponse.data);
        const interestIds = new Set(interestsResponse.data.map(interest => interest.id_category));
        setSelectedCategories(interestIds);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Si falla la obtención de intereses, al menos mostramos las categorías
        if (!categories.length) {
          getCategories().then(res => setCategories(res.data));
        }
      });
    }
  }, [profile]);

  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(categoryId)) {
        newSelected.delete(categoryId);
      } else {
        newSelected.add(categoryId);
      }
      return newSelected;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!profile || !profile.profile.id_customer) {
      alert('Debe iniciar sesión como cliente para guardar sus intereses.');
      return;
    }

    const promises = Array.from(selectedCategories).map(categoryId => {
      return saveInterest(profile.profile.id_customer, categoryId);
    });

    try {
      await Promise.all(promises);
      alert('Intereses guardados con éxito!');
    } catch (error) {
      console.error('Error saving interests:', error);
      alert('Hubo un error al guardar los intereses.');
    }
  };

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
          <div className="card-body p-4"></div>
            <h1>Selecciona tus Intereses</h1>
            <p>Selecciona las categorías de servicios que te interesan para recibir notificaciones y ofertas personalizadas.</p>
            <form onSubmit={handleSubmit}>
              <div className="row">
                {categories.map(category => (
                  <div key={category.id_category} className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`category-${category.id_category}`}
                        value={category.id_category}
                        checked={selectedCategories.has(category.id_category)}
                        onChange={() => handleCheckboxChange(category.id_category)}
                      />
                      <label className="form-check-label" htmlFor={`category-${category.id_category}`}>
                        {category.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" className="btn btn-primary mt-3">Guardar Intereses</button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default InterestsPage;
