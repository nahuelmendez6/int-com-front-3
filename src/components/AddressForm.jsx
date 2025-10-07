import { useState, useEffect } from 'react';

const AddressForm = ({ addressData, onAddressChange, disabled = false }) => {
  const [formData, setFormData] = useState({
    street: addressData?.street || '',
    number: addressData?.number || '',
    floor: addressData?.floor || '',
    apartment: addressData?.apartment || '',
    postal_code: addressData?.postal_code || '',
    city: addressData?.city || '',
    city_name: addressData?.city_detail?.name || ''
  });

  const [cities] = useState([
    { id: 22, name: "San Martín", postal_code: "5400", department: 9 },
    { id: 26, name: "Ciudad de Junin", postal_code: "5587", department: 10 },
    { id: 1, name: "Buenos Aires", postal_code: "1000", department: 1 },
    { id: 2, name: "Córdoba", postal_code: "5000", department: 2 },
    { id: 3, name: "Rosario", postal_code: "2000", department: 3 },
    { id: 4, name: "Mendoza", postal_code: "5500", department: 4 },
    { id: 5, name: "La Plata", postal_code: "1900", department: 1 }
  ]);

  useEffect(() => {
    setFormData({
      street: addressData?.street || '',
      number: addressData?.number || '',
      floor: addressData?.floor || '',
      apartment: addressData?.apartment || '',
      postal_code: addressData?.postal_code || '',
      city: addressData?.city || '',
      city_name: addressData?.city_detail?.name || ''
    });
  }, [addressData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);
    
    // Enviar cambios al componente padre
    const selectedCity = cities.find(c => c.id === parseInt(value));
    onAddressChange({
      street: newFormData.street,
      number: newFormData.number,
      floor: newFormData.floor,
      apartment: newFormData.apartment,
      postal_code: newFormData.postal_code,
      city: newFormData.city,
      city_detail: selectedCity ? {
        id_city: selectedCity.id,
        name: selectedCity.name,
        postal_code: selectedCity.postal_code,
        department: selectedCity.department
      } : null
    });
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const selectedCity = cities.find(c => c.id === parseInt(cityId));
    
    const newFormData = {
      ...formData,
      city: cityId,
      city_name: selectedCity ? selectedCity.name : '',
      postal_code: selectedCity ? selectedCity.postal_code : formData.postal_code
    };
    
    setFormData(newFormData);
    
    onAddressChange({
      street: newFormData.street,
      number: newFormData.number,
      floor: newFormData.floor,
      apartment: newFormData.apartment,
      postal_code: newFormData.postal_code,
      city: newFormData.city,
      city_detail: selectedCity ? {
        id_city: selectedCity.id,
        name: selectedCity.name,
        postal_code: selectedCity.postal_code,
        department: selectedCity.department
      } : null
    });
  };

  return (
    <div className="row">
      <div className="col-12 col-md-8 mb-3">
        <label htmlFor="street" className="form-label">Calle</label>
        <input
          type="text"
          className="form-control"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="Nombre de la calle"
        />
      </div>
      <div className="col-12 col-md-4 mb-3">
        <label htmlFor="number" className="form-label">Número</label>
        <input
          type="text"
          className="form-control"
          id="number"
          name="number"
          value={formData.number}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="123"
        />
      </div>
      <div className="col-6 col-md-4 mb-3">
        <label htmlFor="floor" className="form-label">Piso</label>
        <input
          type="text"
          className="form-control"
          id="floor"
          name="floor"
          value={formData.floor}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="1"
        />
      </div>
      <div className="col-6 col-md-4 mb-3">
        <label htmlFor="apartment" className="form-label">Depto.</label>
        <input
          type="text"
          className="form-control"
          id="apartment"
          name="apartment"
          value={formData.apartment}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="A"
        />
      </div>
      <div className="col-12 col-md-4 mb-3">
        <label htmlFor="postal_code" className="form-label">Código Postal</label>
        <input
          type="text"
          className="form-control"
          id="postal_code"
          name="postal_code"
          value={formData.postal_code}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="5400"
        />
      </div>
      <div className="col-12 col-md-6 mb-3">
        <label htmlFor="city" className="form-label">Ciudad</label>
        <select
          className="form-select"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleCityChange}
          disabled={disabled}
        >
          <option value="">Seleccionar ciudad</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>
              {city.name} ({city.postal_code})
            </option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-6 mb-3">
        <label className="form-label">Ciudad Seleccionada</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-geo-alt"></i>
          </span>
          <input
            type="text"
            className="form-control"
            value={formData.city_name || 'Ninguna ciudad seleccionada'}
            disabled
          />
        </div>
      </div>
      
      {/* Vista previa de la dirección */}
      {formData.street && (
        <div className="col-12">
          <div className="alert alert-light">
            <h6 className="alert-heading">
              <i className="bi bi-eye me-1"></i>
              Vista previa de la dirección:
            </h6>
            <p className="mb-0">
              {formData.street} {formData.number}
              {formData.floor && `, Piso ${formData.floor}`}
              {formData.apartment && `, Depto. ${formData.apartment}`}
              {formData.city_name && `, ${formData.city_name}`}
              {formData.postal_code && ` (${formData.postal_code})`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressForm;
