import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

import './area.for.css'

const ServiceAreaForm = ({
    formData,
    provinces,
    departments,
    cities,
    handleProvinceChange,
    handleDepartmentCheckbox,
    handleCityCheckbox,
    handleSubmit,
    onCancel
}) => {
    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Provincia</Form.Label>
                        <Form.Select name="province" onChange={handleProvinceChange} value={formData.serviceArea.province}>
                            <option value="">Seleccione una provincia</option>
                            {provinces.map(p => (
                                <option key={p.id_province} value={p.id_province}>{p.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            {departments.length > 0 && (
                <Form.Group className="mb-3">
                    <Form.Label>Departamentos</Form.Label>
                    <div className="checkbox-grid">
                        {departments.map(d => (
                            <Form.Check
                                type="checkbox"
                                key={d.id_department}
                                id={`dept-${d.id_department}`}
                                label={d.name}
                                value={d.id_department}
                                onChange={handleDepartmentCheckbox}
                                checked={formData.serviceArea.departments.includes(d.id_department.toString())}
                            />
                        ))}
                    </div>
                </Form.Group>
            )}
            {cities.length > 0 && (
                <Form.Group className="mb-3">
                    <Form.Label>Ciudades</Form.Label>
                    <div className="checkbox-grid">
                        {cities.map(c => (
                            <Form.Check
                                type="checkbox"
                                key={c.id_city}
                                id={`city-${c.id_city}`}
                                label={c.name}
                                value={c.id_city}
                                onChange={handleCityCheckbox}
                                checked={formData.serviceArea.cities.includes(c.id_city.toString())}
                            />
                        ))}
                    </div>
                </Form.Group>
            )}
            <Button variant="primary" type="submit">Guardar Cambios</Button>
            <Button variant="secondary" onClick={onCancel} className="ms-2">Cancelar</Button>
        </Form>
    );
};

export default ServiceAreaForm;