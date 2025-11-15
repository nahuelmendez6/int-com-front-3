import React from 'react';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';


/**
 * @function MaterialSection
 * @description Componente de sección de formulario que permite al usuario gestionar 
 * la lista de materiales cotizados dentro de una postulación. Incluye lógica para 
 * calcular el total basado en la cantidad y el precio unitario.
 * * @param {object[]} materials - El estado actual del array de materiales.
 * @param {function} setMaterials - La función para actualizar el estado del array de materiales.
 * @param {object[]} availableMaterials - Lista de materiales disponibles para seleccionar (cargados desde la API).
 * @param {boolean} loadingMaterials - Indica si la lista de materiales disponibles está cargando.
 * @returns {JSX.Element} Una tarjeta de Bootstrap con la interfaz para gestionar materiales.
 */
export const MaterialSection = ({
  materials,
  setMaterials,
  availableMaterials,
  loadingMaterials,
}) => {

  /**
   * @function handleMaterialChange
   * @description Maneja los cambios en cualquier campo de un material específico.
   * Recalcula automáticamente el campo 'total' si se cambian 'quantity' o 'unit_price',
   * o si se selecciona un nuevo 'id_material' (cargando su precio unitario por defecto).
   * @param {number} index - Índice del material dentro del array `materials`.
   * @param {string} field - El nombre del campo que está siendo modificado ('quantity', 'unit_price', etc.).
   * @param {string} value - El nuevo valor del campo.
   */
  const handleMaterialChange = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;
    // Lógica para recalcular el Total
    if (field === 'quantity' || field === 'unit_price') {
      const q = parseFloat(updated[index].quantity) || 0;
      const p = parseFloat(updated[index].unit_price) || 0;
      updated[index].total = (q * p).toFixed(2);
    }
    // Lógica para autocompletar el precio unitario al seleccionar un material
    if (field === 'id_material') {
      const selected = availableMaterials.find(
        (m) => m.id_material === parseInt(value)
      );
      if (selected) {
        updated[index].unit_price = selected.unit_price;
        updated[index].total = (
          (parseFloat(updated[index].quantity) || 0) * selected.unit_price
        ).toFixed(2);
      }
    }

    setMaterials(updated);
  };
  /**
   * @function addMaterial
   * @description Añade un nuevo elemento de material vacío al array de `materials`.
   */
  const addMaterial = () =>
    setMaterials([
      ...materials,
      { id_material: '', quantity: '', unit_price: '', total: '0.00', notes: '' },
    ]);
  /**
   * @function removeMaterial
   * @description Elimina un material del array por su índice.
   * @param {number} index - Índice del material a eliminar.
   */
  const removeMaterial = (index) =>
    setMaterials(materials.filter((_, i) => i !== index));

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <span>Materiales (Opcional)</span>
          {loadingMaterials && <small className="text-muted">Cargando...</small>}
        </div>
      </Card.Header>
      <Card.Body>
        {materials.map((item, index) => (
          <Row key={index} className="mb-3 align-items-end">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Material</Form.Label>
                <Form.Select
                  value={item.id_material}
                  onChange={(e) =>
                    handleMaterialChange(index, 'id_material', e.target.value)
                  }
                  disabled={loadingMaterials}
                >
                  <option value="">Seleccionar...</option>
                  {availableMaterials.map((mat) => (
                    <option key={mat.id_material} value={mat.id_material}>
                      {mat.name} - ${mat.unit_price} / {mat.unit}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleMaterialChange(index, 'quantity', e.target.value)
                  }
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Precio Unit.</Form.Label>
                <Form.Control
                  type="number"
                  value={item.unit_price}
                  onChange={(e) =>
                    handleMaterialChange(index, 'unit_price', e.target.value)
                  }
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Total</Form.Label>
                <Form.Control type="text" readOnly value={`$${item.total || '0.00'}`} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Notas</Form.Label>
                <Form.Control
                  type="text"
                  value={item.notes}
                  onChange={(e) =>
                    handleMaterialChange(index, 'notes', e.target.value)
                  }
                />
              </Form.Group>
            </Col>
            <Col md={1}>
              <Button variant="danger" size="sm" onClick={() => removeMaterial(index)}>
                <i className="bi bi-trash"></i>
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="secondary" onClick={addMaterial} disabled={loadingMaterials}>
          <i className="bi bi-plus-lg me-1"></i>
          Añadir Material
        </Button>
      </Card.Body>
    </Card>
  );
};
