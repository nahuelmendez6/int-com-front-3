import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getPetitionTypes, createPetition, updatePetition } from '../../services/petitions.service.js';
import { getProfessions, getCategories, getTypeProviders } from '../../services/profile.service.js';


const CreatePetitionForm = ({ show, onHide, petitionToEdit, customerProfile, onPetitionCreatedOrUpdated }) => {
  const [petitionTypes, setPetitionTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [providerTypes, setProviderTypes] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    date_since: '',
    date_until: '',
    id_type_petition: '',
    categories: [],
    id_profession: '',
    id_type_provider: '',
  });

  useEffect(() => {
    if (petitionToEdit) {
      setFormData({
        description: petitionToEdit.description || '',
        date_since: petitionToEdit.date_since || '',
        date_until: petitionToEdit.date_until || '',
        id_type_petition: petitionToEdit.id_type_petition || '',
        categories: petitionToEdit.categories.map(c => ({ id_category: c.id_category })) || [],
        id_profession: petitionToEdit.id_profession || '',
        id_type_provider: petitionToEdit.id_type_provider || '',
      });
    } else {
      setFormData({
        
        description: '',
        date_since: '',
        date_until: '',
        id_type_petition: '',
        categories: [],
        id_profession: '',
        id_type_provider: '',
      });
    }
  }, [petitionToEdit]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [types, cats, professions, providerTypes] = await Promise.all([
          getPetitionTypes(),
          getCategories(),
          getProfessions(),
          getTypeProviders(),
        ]);
        setPetitionTypes(types);
        console.log("Petition Types:", types);
        const sortedCats = cats.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedCats);
        console.log("Categories:", sortedCats);
        setProfessions(professions);
        console.log("Professions:", professions);
        setProviderTypes(providerTypes);
        console.log("Provider Types:", providerTypes);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const categoryId = parseInt(value, 10);
    let selectedCategories = [...formData.categories];
    if (checked) {
      selectedCategories.push({ id_category: categoryId });
    } else {
      selectedCategories = selectedCategories.filter(cat => cat.id_category !== categoryId);
    }
    setFormData({ ...formData, categories: selectedCategories });
  };

  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const petitionFormData = new FormData();

    petitionFormData.append('id_customer', customerProfile.profile.id_customer);
    petitionFormData.append('id_state', 1);

    // Append form data
    Object.keys(formData).forEach(key => {
      if (key === 'categories') {
        // Handled separately
      } else {
        petitionFormData.append(key, formData[key]);
      }
    });

    // Append each category id
    formData.categories.forEach(cat => {
      petitionFormData.append('categories', cat.id_category);
    });

    // Append attachments
    attachments.forEach(file => {
      petitionFormData.append('attachments', file);
    });

    try {
      if (petitionToEdit) {
        await updatePetition(petitionToEdit.id_petition, petitionFormData);
      } else {
        await createPetition(petitionFormData);
      }
      onHide();
      onPetitionCreatedOrUpdated(); // Notify parent to refresh petitions
    } catch (error) {
      console.error('Error saving petition:', error);
    }
  };


  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{petitionToEdit ? 'Editar Petición' : 'Crear Petición'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Petición</Form.Label>
                <Form.Select name="id_type_petition" value={formData.id_type_petition} onChange={handleChange}>
                  <option value="">Seleccione un tipo</option>
                  {petitionTypes.map(type => (
                    <option key={type.id_type_petition} value={type.id_type_petition}>{type.type_petition}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Profesión</Form.Label>
                <Form.Select name="id_profession" value={formData.id_profession} onChange={handleChange}>
                  <option value="">Seleccione una profesión</option>
                  {professions.map(profession => (
                    <option key={profession.id_profession} value={profession.id_profession}>{profession.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tipo de Proveedor</Form.Label>
                <Form.Select name="id_type_provider" value={formData.id_type_provider} onChange={handleChange}>
                  <option value="">Seleccione un tipo de proveedor</option>
                  {providerTypes.map(providerType => (
                    <option key={providerType.id_type_provider} value={providerType.id_type_provider}>{providerType.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Desde</Form.Label>
                <Form.Control type="date" name="date_since" value={formData.date_since} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Hasta</Form.Label>
                <Form.Control type="date" name="date_until" value={formData.date_until} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Categorías</Form.Label>
            <Row>
              {categories.map(cat => (
                <Col md={4} key={cat.id_category}>
                  <Form.Check
                    type="checkbox"
                    label={cat.name}
                    value={cat.id_category}
                    checked={formData.categories.some(c => c.id_category === cat.id_category)}
                    onChange={handleCategoryChange}
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Adjuntos</Form.Label>
            <Form.Control type="file" multiple onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>{petitionToEdit ? 'Guardar Cambios' : 'Crear'}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePetitionForm;
