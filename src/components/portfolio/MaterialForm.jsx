import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import materialService from '../../services/material.service';

const MaterialForm = ({ onSuccess, material = null, providerId }) => {
  const [formData, setFormData] = useState({
    name: material?.name || '',
    description: material?.description || '',
    unit_price: material?.unit_price || '',
    unit: material?.unit || 'unidad',
    id_provider: providerId
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (material) {
        // Update existing material
        await materialService.updateMaterial(material.id_material, formData);
      } else {
        // Create new material
        const newMaterialResponse = await materialService.createMaterial(formData);
        const newMaterialId = newMaterialResponse.data.id_material;

        // Upload attachments if any files were selected
        if (files.length > 0) {
          const uploadPromises = Array.from(files).map(file => 
            materialService.createMaterialAttachment(newMaterialId, file)
          );
          await Promise.all(uploadPromises);
        }
      }
      
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response && err.response.data) {
        // The backend sent back validation errors
        console.error("Validation Error:", err.response.data);
        const errorMessages = Object.entries(err.response.data).map(([field, messages]) => 
          `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
        ).join('; ');
        setError(`Error de validación: ${errorMessages}`);
      } else {
        setError('Error al guardar el material. Por favor, inténtalo de nuevo.');
        console.error(err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Material/Producto *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Cemento Portland, Pintura Acrílica..."
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Precio Unitario *</Form.Label>
            <Form.Control
              type="number"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
            <Form.Text className="text-muted">
              Precio por unidad en pesos argentinos
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Unidad de Medida</Form.Label>
            <Form.Select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              <option value="unidad">Unidad</option>
              <option value="kg">Kilogramo (kg)</option>
              <option value="m">Metro (m)</option>
              <option value="m2">Metro cuadrado (m²)</option>
              <option value="m3">Metro cúbico (m³)</option>
              <option value="litro">Litro</option>
              <option value="bolsa">Bolsa</option>
              <option value="caja">Caja</option>
              <option value="rollo">Rollo</option>
              <option value="hoja">Hoja</option>
              <option value="otro">Otro</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Unidad Personalizada</Form.Label>
            <Form.Control
              type="text"
              name="unit"
              value={formData.unit === 'otro' ? '' : formData.unit}
              onChange={handleChange}
              placeholder="Especifica la unidad"
              disabled={formData.unit !== 'otro'}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Describe las características, especificaciones técnicas, o cualquier detalle relevante del material..."
        />
        <Form.Text className="text-muted">
          Información adicional que ayude a los clientes a entender mejor el producto
        </Form.Text>
      </Form.Group>

      {/* File Input for Attachments - Only on Create */}
      {!material && (
        <Form.Group className="mb-3">
          <Form.Label>Archivos Adjuntos</Form.Label>
          <Form.Control 
            type="file" 
            multiple 
            onChange={(e) => setFiles(e.target.files)}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          />
          <Form.Text className="text-muted">
            Sube imágenes, documentos o especificaciones técnicas del material. 
            Formatos permitidos: imágenes, PDF, Word, Excel.
          </Form.Text>
        </Form.Group>
      )}

      <div className="d-flex justify-content-end gap-2">
        <Button 
          variant="secondary" 
          type="button" 
          onClick={() => onSuccess && onSuccess()}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={submitting}
        >
          {submitting ? 'Guardando...' : (material ? 'Actualizar Material' : 'Crear Material')}
        </Button>
      </div>
    </Form>
  );
};

export default MaterialForm;
