import React from 'react';
import { Form } from 'react-bootstrap';

const ServiceAreaForm = ({
  formData,
  provinces,
  departments,
  cities,
  handleProvinceChange,
  handleDepartmentCheckbox,
  handleCityCheckbox,
}) => {
  console.log('ServiceAreaForm received cities:', cities);
  return (
  <>
    <Form.Select name="serviceArea.province" value={formData.serviceArea.province} onChange={handleProvinceChange}>
      <option value="">Seleccione una provincia</option>
      {provinces.map((p) => (
        <option key={p.id_province} value={p.id_province}>{p.name}</option>
      ))}
    </Form.Select>

    {departments.length > 0 && (
      <Form.Group className="mb-3">
        <Form.Label>Departamentos donde ofrece servicios</Form.Label>
        {departments.map((d) => (
          <Form.Check
            key={d.id_department}
            type="checkbox"
            label={d.name}
            value={d.id_department}
            checked={formData.serviceArea.departments.includes(d.id_department.toString())}
            onChange={handleDepartmentCheckbox}
          />
        ))}
      </Form.Group>
    )}

    {cities.length > 0 && (
      <Form.Group className="mb-3">
        <Form.Label>Ciudades donde ofrece servicios</Form.Label>
        {cities.map((c) => (
          <Form.Check
            key={c.id_city}
            type="checkbox"
            label={c.name}
            value={c.id_city}
            checked={formData.serviceArea.cities.includes(c.id_city.toString())}
            onChange={handleCityCheckbox}
          />
        ))}
      </Form.Group>
    )}
  </>
);
};

export default ServiceAreaForm;
