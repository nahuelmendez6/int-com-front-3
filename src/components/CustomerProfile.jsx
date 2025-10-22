import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service.js';
import { getProvinces, getDepartmentsByProvince, getCitiesByDepartment } from '../services/location.service.js';
import AddressForm from './AddressForm.jsx';
import ImageUpload from './ImageUpload.jsx';

const CustomerProfile = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Datos de usuario y perfil
  const [profileData, setProfileData] = useState(userData.profile || {});
  const [user, setUser] = useState(userData.user || {});

  // Formulario editable
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone_number: profileData.phone_number || '',
    address: profileData.address || {},
  });
  const [imageFile, setImageFile] = useState(null);

  // Opciones de ubicación
  const [provinces, setProvinces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);

  // Cargar provincias al iniciar
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provRes = await getProvinces();
        setProvinces(provRes);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProvinces();
  }, []);

  // Cambios en los inputs de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Cambios en la dirección
  const handleAddressChange = (address) => {
    setFormData({ ...formData, address });
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    handleAddressChange({ ...formData.address, province: provinceId, department: '', city: '' });
    if (provinceId) {
      const deps = await getDepartmentsByProvince(provinceId);
      setDepartments(deps);
      setCities([]);
    } else {
      setDepartments([]);
      setCities([]);
    }
  };

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    handleAddressChange({ ...formData.address, department: departmentId, city: '' });
    if (departmentId) {
      const cits = await getCitiesByDepartment(departmentId);
      setCities(cits);
    } else {
      setCities([]);
    }
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (imageFile) data.append('profile_image', imageFile);
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('email', formData.email);
      data.append('phone_number', formData.phone_number);
      if (formData.address) {
        data.append('address', JSON.stringify(formData.address));
      }

      const res = await profileService.updateProfile(data);

      // Actualizamos localmente los datos
      setProfileData(res.data.customer || profileData);
      setUser(res.data.user || user);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!isEditing) {
    const addr = profileData.address;
    const fullAddress = addr
      ? `${addr.street || ''} ${addr.number || ''}, ${addr.city_detail?.name || ''}`
      : 'No registrada';

    return (
      <div className="social-card">
        <div className="row g-3">
          <div className="col-md-4 text-center">
            <ImageUpload currentImage={user.profile_image} disabled />
            <h4 className="mt-3 fw-bold">
              <i className="bi bi-person-circle me-2"></i>
              {user.first_name} {user.last_name}
            </h4>
            <p className="text-muted">
              <i className="bi bi-envelope me-1"></i>
              {user.email}
            </p>
            <p className="text-muted">
              <i className="bi bi-telephone me-1"></i>
              <strong>Teléfono:</strong> {profileData.phone_number || 'No registrado'}
            </p>
          </div>
          <div className="col-md-8">
            <h5 className="border-start border-3 border-primary ps-3 mb-3 fw-semibold">
              <i className="bi bi-geo-alt me-2"></i>
              Dirección
            </h5>
            <p className="text-muted">{fullAddress}</p>
          </div>
        </div>
        <div className="d-grid d-md-flex justify-content-md-end mt-4">
          <button onClick={() => setIsEditing(true)} className="btn btn-social btn-primary-social">
            <i className="bi bi-pencil-square me-2"></i>Editar Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="social-card">
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-4 text-center">
            <ImageUpload currentImage={user.profile_image} onFileSelect={setImageFile} />
          </div>
          <div className="col-md-8">
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre</label>
              <input className="form-control form-control-social" name="first_name" value={formData.first_name} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Apellido</label>
              <input className="form-control form-control-social" name="last_name" value={formData.last_name} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input className="form-control form-control-social" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Teléfono</label>
              <input className="form-control form-control-social" name="phone_number" value={formData.phone_number} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <h5 className="border-start border-3 border-primary ps-3 mb-3 fw-semibold">
          <i className="bi bi-geo-alt me-2"></i>
          Dirección
        </h5>
        <AddressForm
          addressData={formData.address}
          provinces={provinces}
          departments={departments}
          cities={cities}
          onAddressChange={handleAddressChange}
          onProvinceChange={handleProvinceChange}
          onDepartmentChange={handleDepartmentChange}
        />

        <div className="d-grid d-md-flex justify-content-md-end gap-2 mt-4">
          <button type="submit" className="btn btn-social btn-success-social">
            <i className="bi bi-check-circle me-2"></i>Guardar Cambios
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="btn btn-social btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerProfile;

