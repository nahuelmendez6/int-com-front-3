import { useState } from 'react';
import AddressForm from './AddressForm';
import ImageUpload from './ImageUpload';

const CustomerProfile = ({ userData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Datos del usuario
    name: userData?.user?.name || '',
    lastname: userData?.user?.lastname || '',
    email: userData?.user?.email || '',
    profile_image: userData?.user?.profile_image || '',
    
    // Datos del perfil de cliente
    dni: userData?.profile?.dni || '',
    phone: userData?.profile?.phone || '',
    
    // Dirección
    address: userData?.profile?.address || {}
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    console.log('Datos del cliente a actualizar:', formData);
    
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
        dni: formData.dni,
        phone: formData.phone,
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
      dni: userData?.profile?.dni || '',
      phone: userData?.profile?.phone || '',
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
                <i className="bi bi-person-badge me-1"></i>
                Cliente
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
                <div className="mb-3">
                  <label htmlFor="dni" className="form-label">DNI</label>
                  <input
                    type="text"
                    className="form-control"
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Ingrese su DNI"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Ingrese su número de teléfono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-telephone me-2"></i>
                  Información de Contacto
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Email Actual</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      disabled
                    />
                  </div>
                  <div className="form-text">
                    El email no se puede modificar por seguridad
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Teléfono de Contacto</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                </div>
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Importante:</strong> Mantén tu información de contacto actualizada para recibir notificaciones sobre tus solicitudes de servicios.
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
                <div className="alert alert-warning mt-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Nota:</strong> Tu dirección es importante para que los proveedores puedan ubicarte y ofrecerte servicios en tu zona.
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerProfile;
