import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { getPetitionTypes, createPetition, updatePetition } from '../../services/petitions.service.js';
import { getProfessions, getCategories, getTypeProviders } from '../../services/profile.service.js';

/**
 * @function CreatePetitionForm
 * @description Componente de formulario modal utilizado para crear o editar una petición (solicitud de servicio)
 * por parte de un cliente. Se encarga de cargar datos de selección (tipos de petición, categorías, etc.)
 * y manejar la lógica de envío de formularios multipart/form-data, incluyendo archivos adjuntos.
 * * @param {boolean} show - Controla la visibilidad del Modal.
 * @param {function} onHide - Callback que se ejecuta al cerrar el Modal.
 * @param {object | null} petitionToEdit - Objeto de petición si estamos en modo edición; `null` si es creación.
 * @param {object} customerProfile - Información del perfil del cliente, incluyendo `id_customer`.
 * @param {function} onPetitionCreatedOrUpdated - Callback para notificar al componente padre que debe refrescar la lista.
 * @returns {JSX.Element} El Modal con el formulario de creación/edición de petición.
 */
const CreatePetitionForm = ({ show, onHide, petitionToEdit, customerProfile, onPetitionCreatedOrUpdated }) => {
  
  // 1. Estados para Datos de Selección (Lookups)
  const [petitionTypes, setPetitionTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [providerTypes, setProviderTypes] = useState([]);
  
  // Estado para manejar los archivos adjuntos (se envían como FormData).
  const [attachments, setAttachments] = useState([]);


  // 2. Estado del Formulario
  const [formData, setFormData] = useState({
    description: '',
    date_since: '',
    date_until: '',
    id_type_petition: '',
    categories: [], // Almacena IDs de categorías seleccionadas, posiblemente como objetos { id_category: X }
    id_profession: '',
    id_type_provider: '',
  });

  // 3. useEffect: Inicialización del Formulario (Modo Edición o Creación)
  useEffect(() => {
    if (petitionToEdit) {
      // Lógica de mapeo de categorías para edición: asegura que el formato sea consistente ({ id_category: X })
      let categoriesData = [];
      if (petitionToEdit.categories && Array.isArray(petitionToEdit.categories)) {
        categoriesData = petitionToEdit.categories.map(c => {
          // Handle both formats: { id_category: X } or just X
          if (typeof c === 'object' && c.id_category) {
            return { id_category: c.id_category };
          } else if (typeof c === 'number') {
            return { id_category: c };
          }
          return null;
        }).filter(Boolean);
      }
      // Estado inicial para el modo Creación
      setFormData({
        description: petitionToEdit.description || '',
        date_since: petitionToEdit.date_since || '',
        date_until: petitionToEdit.date_until || '',
        id_type_petition: petitionToEdit.id_type_petition || '',
        categories: categoriesData,
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
      setAttachments([]);
    }
  }, [petitionToEdit]); // Se ejecuta al cambiar la petición a editar (o al abrir el modal).

  // 4. useEffect: Carga de Datos Iniciales (Tipos de Petición, Categorías, etc.)
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
        
        // Debug: Log raw categories structure
        console.log("Raw Categories from API:", cats);
        if (cats && cats.length > 0) {
          console.log("First category structure:", cats[0]);
          console.log("Category keys:", Object.keys(cats[0]));
        }
        
        const sortedCats = cats.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedCats);
        console.log("Sorted Categories:", sortedCats);
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

  // Se ejecuta solo al montar el componente.

  /**
   * @function handleChange
   * @description Handler genérico para campos de texto y select simples.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * @function handleCategoryChangeDirect
   * @description Handler principal para checkboxes de categorías.
   * Utiliza el ID de la categoría directamente (desde el closure) y no depende del `e.target.value`
   * para evitar errores de propagación de eventos en React/Browsers.
   * @param {number} categoryId - El ID numérico de la categoría.
   * @param {boolean} checked - Si el checkbox está marcado o desmarcado.
   * @param {object} categoryObj - El objeto completo de la categoría.
   */
  const handleCategoryChangeDirect = (categoryId, checked, categoryObj) => {
    // Debug: Log category selection with full details
    console.log('=== Category checkbox changed (DIRECT) ===');
    console.log('Direct parameters:', { 
      categoryId, 
      checked,
      categoryName: categoryObj?.name,
      categoryObject: categoryObj
    });
    console.log('Current selected categories before change:', formData.categories);
    
    if (!categoryId || isNaN(categoryId)) {
      console.error('ERROR: Invalid category ID:', categoryId);
      return;
    }
    
    let selectedCategories = [...formData.categories];
    if (checked) {
      // Check if category already exists to avoid duplicates
      const exists = selectedCategories.some(cat => {
        const id = typeof cat === 'object' && cat.id_category ? cat.id_category : cat;
        return id === categoryId;
      });
      
      if (!exists) {
        selectedCategories.push({ id_category: categoryId });
        console.log('✅ Category ADDED. ID:', categoryId, 'Name:', categoryObj?.name);
        console.log('Updated selected categories:', selectedCategories.map(c => {
          const id = typeof c === 'object' && c.id_category ? c.id_category : c;
          return { id, name: categories.find(cat => (cat.id_category || cat.id) === id)?.name };
        }));
      } else {
        console.log('⚠️ Category already exists, skipping duplicate');
      }
    } else {
      const beforeCount = selectedCategories.length;
      selectedCategories = selectedCategories.filter(cat => {
        const id = typeof cat === 'object' && cat.id_category ? cat.id_category : cat;
        return id !== categoryId;
      });
      const afterCount = selectedCategories.length;
      console.log('Category REMOVED. ID:', categoryId, 'Name:', categoryObj?.name);
      console.log(`Categories count: ${beforeCount} -> ${afterCount}`);
      console.log('Updated selected categories:', selectedCategories.map(c => {
        const id = typeof c === 'object' && c.id_category ? c.id_category : c;
        return { id, name: categories.find(cat => (cat.id_category || cat.id) === id)?.name };
      }));
    }
    setFormData({ ...formData, categories: selectedCategories });
  };


  const handleCategoryChange = (e) => {
    const { value, checked, id } = e.target;
    const categoryId = parseInt(value, 10);
    
    // Find the category object to get its name for debugging
    const categoryObj = categories.find(cat => {
      const cId = cat.id_category || cat.id;
      return cId === categoryId;
    });
    
    // Use the direct handler
    handleCategoryChangeDirect(categoryId, checked, categoryObj);
  };

  /**
   * @function handleFileChange
   * @description Almacena los archivos seleccionados por el usuario.
   */
  const handleFileChange = (e) => {
    setAttachments([...e.target.files]);
  };
  /**
   * @async
   * @function handleSubmit
   * @description Prepara y envía los datos del formulario a la API (creación o actualización).
   * Utiliza `FormData` para manejar la mezcla de datos JSON y archivos.
   * @param {Event} e - Evento de envío del formulario.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const petitionFormData = new FormData();

    petitionFormData.append('id_customer', customerProfile.profile.id_customer);
    petitionFormData.append('id_state', '1');

    // Append form data (excluding categories and empty values)
    Object.keys(formData).forEach(key => {
      if (key === 'categories') {
        // Handled separately below
        return;
      }
      const value = formData[key];
      // Only append non-empty values
      if (value !== '' && value !== null && value !== undefined) {
        petitionFormData.append(key, String(value));
      }
    });

    // Append each category id as string (FormData requires strings)
    // Ensure categories is an array and has items
    console.log('=== PREPARING CATEGORIES FOR SUBMISSION ===');
    console.log('formData.categories:', formData.categories);
    console.log('formData.categories type:', typeof formData.categories);
    console.log('formData.categories isArray:', Array.isArray(formData.categories));
    console.log('formData.categories length:', formData.categories?.length);
    
    if (formData.categories && Array.isArray(formData.categories) && formData.categories.length > 0) {
      const categoryIds = [];
      
      // First, log all categories with their names for verification
      console.log('=== CATEGORIES WITH NAMES ===');
      formData.categories.forEach((cat, idx) => {
        const id = typeof cat === 'object' && cat.id_category ? cat.id_category : cat;
        const catObj = categories.find(c => (c.id_category || c.id) === id);
        console.log(`Category ${idx + 1}:`, {
          stored: cat,
          extractedId: id,
          name: catObj?.name || 'NOT FOUND',
          fullCategoryObject: catObj
        });
      });
      
      formData.categories.forEach((cat, index) => {
        // Handle multiple possible formats
        let categoryId = null;
        
        if (typeof cat === 'object') {
          // Try different possible ID fields
          categoryId = cat.id_category || cat.id || cat.category_id || null;
          console.log(`Processing category ${index + 1} (object):`, {
            cat,
            id_category: cat.id_category,
            id: cat.id,
            category_id: cat.category_id,
            extracted: categoryId
          });
        } else if (typeof cat === 'number') {
          categoryId = cat;
          console.log(`Processing category ${index + 1} (number):`, cat);
        } else if (typeof cat === 'string') {
          // If it's a string, try to parse it
          const parsed = parseInt(cat, 10);
          if (!isNaN(parsed)) {
            categoryId = parsed;
          }
          console.log(`Processing category ${index + 1} (string):`, { cat, parsed, categoryId });
        }
        
        if (categoryId !== null && !isNaN(categoryId)) {
          // Convert to string as FormData requires strings, but ensure it's a valid number
          const idAsString = String(categoryId);
          
          // Find the category name for verification
          const catObj = categories.find(c => (c.id_category || c.id) === categoryId);
          
          // Try multiple formats to ensure backend compatibility
          // Some Django backends expect 'categories[]' when using request.data.getlist()
          petitionFormData.append('categories', idAsString);
          // Note: Some backends may need categories[] format, but sending both might cause duplicates
          // Uncomment the line below if the backend specifically requires categories[]
          // petitionFormData.append('categories[]', idAsString);
          
          categoryIds.push(parseInt(idAsString, 10));
          
          // Debug: Log each category being added with name verification
          console.log(`✅ Category ${index + 1} being sent to backend:`, {
            original: cat,
            extractedId: categoryId,
            asString: idAsString,
            categoryName: catObj?.name || 'NOT FOUND IN CATEGORIES LIST',
            verified: catObj ? 'YES' : 'NO - ID NOT FOUND IN CATEGORIES'
          });
        } else {
          console.error(`❌ Category ${index + 1} could not be processed:`, cat);
        }
      });
      
      console.log('=== FINAL CATEGORY IDs BEING SENT ===');
      console.log('All category IDs (numbers):', categoryIds);
      console.log('FormData categories entries (as they will be sent):');
      
      // Final verification: check each ID against available categories
      const invalidIds = [];
      petitionFormData.getAll('categories').forEach((id, idx) => {
        const catObj = categories.find(c => String(c.id_category || c.id) === String(id));
        const isValid = catObj !== undefined;
        if (!isValid) {
          invalidIds.push(id);
        }
        console.log(`  categories[${idx}]: "${id}" (type: ${typeof id}) -> ${catObj?.name || 'NOT FOUND'} ${isValid ? '✅' : '❌ INVALID'}`);
      });
      
      if (invalidIds.length > 0) {
        console.error('❌ ERROR: Invalid category IDs detected:', invalidIds);
        console.error('Available category IDs:', categories.map(c => c.id_category || c.id));
        alert(`Error: Se detectaron IDs de categorías inválidos: ${invalidIds.join(', ')}. Por favor, revisa la consola.`);
        return; // Stop submission if invalid IDs found
      }
      
      console.log('✅ All category IDs are valid and will be sent to backend');
    } else {
      console.warn('No categories selected or categories array is empty');
    }

    // Append attachments
    attachments.forEach(file => {
      petitionFormData.append('attachments', file);
    });

    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (let pair of petitionFormData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

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
      if (error.response?.data) {
        console.error('Error details:', error.response.data);
      }
      alert('Error al guardar la petición. Por favor, revisa la consola para más detalles.');
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
              {categories.map((cat, index) => {
                // Ensure we're using the correct ID field
                const categoryId = cat.id_category || cat.id;
                const categoryName = cat.name || cat.name_category || '';
                
                // Debug first few categories to see structure
                if (index < 3) {
                  console.log(`Rendering category ${index}:`, { 
                    name: categoryName, 
                    id_category: cat.id_category,
                    categoryId: categoryId,
                    catObject: cat 
                  });
                }
                
                const isChecked = formData.categories.some(c => {
                  const cId = typeof c === 'object' && c.id_category ? c.id_category : c;
                  return cId === categoryId;
                });
                
                // Create a handler that uses the category object directly
                // This ensures we always use the correct ID regardless of event value issues
                const handleThisCategoryChange = (e) => {
                  const checked = e.target.checked;
                  console.log(`Checkbox clicked for "${categoryName}":`, {
                    categoryId: categoryId,
                    categoryName: categoryName,
                    eventValue: e.target.value,
                    checked: checked,
                    expectedId: categoryId,
                    match: String(categoryId) === String(e.target.value)
                  });
                  
                  // Use the categoryId directly from the closure, not from the event
                  handleCategoryChangeDirect(categoryId, checked, cat);
                };
                
                return (
                  <Col md={4} key={categoryId || cat.id}>
                    <Form.Check
                      type="checkbox"
                      id={`category-checkbox-${categoryId}`}
                      label={categoryName}
                      value={String(categoryId)}
                      checked={isChecked}
                      onChange={handleThisCategoryChange}
                    />
                  </Col>
                );
              })}
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
