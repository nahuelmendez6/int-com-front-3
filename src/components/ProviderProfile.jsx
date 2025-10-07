import { useState } from 'react';
import AddressForm from './AddressForm';
import ImageUpload from './ImageUpload';

const ProviderProfile = ({ userData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Datos del usuario
    name: userData?.user?.name || '',
    lastname: userData?.user?.lastname || '',
    email: userData?.user?.email || '',
    profile_image: userData?.user?.profile_image || '',
    
    // Datos del perfil de proveedor
    description: userData?.profile?.description || '',
    profession: userData?.profile?.profession?.id_profession || '',
    type_provider: userData?.profile?.type_provider?.id_type_provider || '',
    categories: userData?.profile?.categories?.map(cat => cat.id_category) || [],
    
    // Dirección
    address: userData?.profile?.address || {}
  });

  const [availableProfessions] = useState([
    { id: 1, name: "Arquitecto" },
    { id: 2, name: "Ingeniero" },
    { id: 3, name: "Abogado" },
    { id: 4, name: "Médico" },
    { id: 5, name: "Contador" },
    { id: 19, name: "Arquitecto" }
  ]);

  const [availableTypes] = useState([
    { id: 1, name: "Particular" },
    { id: 2, name: "Empresa" },
    { id: 3, name: "Cooperativa" }
  ]);

  const [availableCategories] = useState([
    { id: 1, name: "Construcción y Reparaciones" },
    { id: 2, name: "Servicios de Limpieza" },
    { id: 3, name: "Servicios de Jardinería" },
    { id: 4, name: "Servicios de Plomería" },
    { id: 5, name: "Servicios Eléctricos" },
    { id: 14, name: "Servicios Profesionales" }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, ...addressData }
    }));
  };

  const handleImageChange = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      profile_image: imageUrl
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí se enviarían los datos a la API
    console.log('Datos del proveedor a actualizar:', formData);
    
    // Simular actualización exitosa
    onUpdate({
      user: {
        ...userData.user,
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        profile_image: formData.profile_image
      },
      profile: {
        ...userData.profile,
        description: formData.description,
        profession: availableProfessions.find(p => p.id === parseInt(formData.profession)),
        type_provider: availableTypes.find(t => t.id === parseInt(formData.type_provider)),
        categories: availableCategories.filter(c => formData.categories.includes(c.id)),
        address: formData.address
      }
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.user?.name || '',
      lastname: userData?.user?.lastname || '',
      email: userData?.user?.email || '',
      profile_image: userData?.user?.profile_image || '',
      description: userData?.profile?.description || '',
      profession: userData?.profile?.profession?.id_profession || '',
      type_provider: userData?.profile?.type_provider?.id_type_provider || '',
      categories: userData?.profile?.categories?.map(cat => cat.id_category) || [],
      address: userData?.profile?.address || {}
    });
    setIsEditing(false);
  };

  return (
    <div>
      {/* Header con imagen de perfil */}
      <div className="row mb-4">
        <div className="col-12 col-md-3 text-center mb-3 mb-md-0">
          <ImageUpload
            currentImage={formData.profile_image}
            onImageChange={handleImageChange}
            disabled={!isEditing}
          />
        </div>
        <div className="col-12 col-md-9">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
            <div className="mb-3 mb-md-0">
              <h2 className="mb-1 h4 h-md-2">
                {userData?.user?.name} {userData?.user?.lastname}
              </h2>
              <p className="text-muted mb-2 small">
                <i className="bi bi-envelope me-1"></i>
                {userData?.user?.email}
              </p>
              <p className="text-muted mb-0 small">
                <i className="bi bi-briefcase me-1"></i>
                {userData?.profile?.profession?.name} - {userData?.profile?.type_provider?.name}
              </p>
            </div>
            <div className="w-100 w-md-auto">
              {!isEditing ? (
                <button 
                  className="btn btn-primary w-100 w-md-auto"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil me-1"></i>
                  Editar Perfil
                </button>
              ) : (
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <button 
                    className="btn btn-success flex-fill"
                    onClick={handleSubmit}
                  >
                    <i className="bi bi-check me-1"></i>
                    Guardar
                  </button>
                  <button 
                    className="btn btn-secondary flex-fill"
                    onClick={handleCancel}
                  >
                    <i className="bi bi-x me-1"></i>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Información Personal */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-person me-2"></i>
                  Información Personal
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastname" className="form-label">Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información Profesional */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-briefcase me-2"></i>
                  Información Profesional
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="profession" className="form-label">Profesión</label>
                  <select
                    className="form-select"
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="">Seleccionar profesión</option>
                    {availableProfessions.map(prof => (
                      <option key={prof.id} value={prof.id}>
                        {prof.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="type_provider" className="form-label">Tipo de Proveedor</label>
                  <select
                    className="form-select"
                    id="type_provider"
                    name="type_provider"
                    value={formData.type_provider}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    <option value="">Seleccionar tipo</option>
                    {availableTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Categorías</label>
                  <div className="row">
                    {availableCategories.map(category => (
                      <div key={category.id} className="col-12 col-sm-6 col-md-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={formData.categories.includes(category.id)}
                            onChange={() => handleCategoryChange(category.id)}
                            disabled={!isEditing}
                          />
                          <label className="form-check-label small" htmlFor={`category-${category.id}`}>
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

          {/* Descripción */}
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-file-text me-2"></i>
                  Descripción
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descripción Profesional</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Describe tus servicios y experiencia profesional..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-geo-alt me-2"></i>
                  Dirección
                </h5>
              </div>
              <div className="card-body">
                <AddressForm
                  addressData={formData.address}
                  onAddressChange={handleAddressChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProviderProfile;
