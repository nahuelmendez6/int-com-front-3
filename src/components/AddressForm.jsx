import React from 'react';

const AddressForm = ({
  addressData,
  provinces,
  departments,
  cities,
  onAddressChange,
  onProvinceChange,
  onDepartmentChange,
}) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    onAddressChange({ ...addressData, [name]: value });
  };

  return (
    <fieldset className="border p-3 rounded mb-3">
      <legend className="w-auto float-none fs-6 p-1">Dirección</legend>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="street" className="form-label">Calle</label>
          <input type="text" className="form-control" id="street" name="street" value={addressData?.street || ''} onChange={handleChange} />
        </div>
        <div className="col-md-2 mb-3">
          <label htmlFor="number" className="form-label">Número</label>
          <input type="text" className="form-control" id="number" name="number" value={addressData?.number || ''} onChange={handleChange} />
        </div>
        <div className="col-md-2 mb-3">
          <label htmlFor="floor" className="form-label">Piso</label>
          <input type="text" className="form-control" id="floor" name="floor" value={addressData?.floor || ''} onChange={handleChange} />
        </div>
        <div className="col-md-2 mb-3">
          <label htmlFor="apartment" className="form-label">Dpto.</label>
          <input type="text" className="form-control" id="apartment" name="apartment" value={addressData?.apartment || ''} onChange={handleChange} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label htmlFor="province" className="form-label">Provincia</label>
          <select id="province" className="form-select" name="province" value={addressData?.province || ''} onChange={onProvinceChange}>
            <option value="">Seleccione provincia</option>
            {provinces.map((p) => (
              <option key={p.id_province} value={p.id_province}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="department" className="form-label">Departamento</label>
          <select id="department" className="form-select" name="department" value={addressData?.department || ''} onChange={onDepartmentChange} disabled={!departments.length}>
            <option value="">Seleccione departamento</option>
            {departments.map((d) => (
              <option key={d.id_department} value={d.id_department}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="city" className="form-label">Ciudad</label>
          <select id="city" className="form-select" name="city" value={addressData?.city || ''} onChange={handleChange} disabled={!cities.length}>
            <option value="">Seleccione ciudad</option>
            {cities.map((c) => (
              <option key={c.id_city} value={c.id_city}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
       <div className="col-md-4 mb-3">
          <label htmlFor="postal_code" className="form-label">Código Postal</label>
          <input type="text" className="form-control" id="postal_code" name="postal_code" value={addressData?.postal_code || ''} onChange={handleChange} />
        </div>
    </fieldset>
  );
};

export default AddressForm;