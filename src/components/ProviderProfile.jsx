import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service.js';
import {
  getProvinces,
  getDepartmentsByProvince,
  getCitiesByDepartment
} from '../services/location.service.js';
import AddressForm from './AddressForm.jsx';
import ImageUpload from './ImageUpload.jsx';

const ProviderProfile = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userData);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  // Opciones de perfil
  const [categories, setCategories] = useState([]);
  const [typeProviders, setTypeProviders] = useState([]);
  const [professions, setProfessions] = useState([]);

  // Opciones de ubicación
  const [provinces, setProvinces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, typeProvRes, profRes, provRes] = await Promise.all([
          profileService.getCategories(),
          profileService.getTypeProviders(),
          profileService.getProfessions(),
          getProvinces(),
        ]);

        console.log('🔍 catRes:', catRes);
      console.log('🔍 typeProvRes:', typeProvRes);
      console.log('🔍 profRes:', profRes);


        setCategories(catRes|| []);
        setTypeProviders(typeProvRes || []);
        setProfessions(profRes|| []);
        setProvinces(provRes || []);
        console.log('categorias',categories);
        console.log(typeProviders);
        console.log(professions);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const startEditing = () => {
    setFormData({
      description: profile.profile?.description || '',
      phone_number: profile.profile?.phone_number || '',
      categories: (profile.profile?.categories || []).map(c => c.id_category),
      type_provider: profile.profile?.type_provider?.id_type_provider || '',
      profession: profile.profile?.profession?.id_profession || '',
      address: profile.profile?.address || {},
    });
    setDepartments([]);
    setCities([]);
    setImageFile(null);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const categoryId = parseInt(value);
    setFormData(prev => {
      let updated = prev.categories || [];
      updated = checked
        ? [...updated, categoryId]
        : updated.filter(id => id !== categoryId);
      return { ...prev, categories: updated };
    });
  };

  const handleAddressChange = (address) => {
    setFormData(prev => ({ ...prev, address }));
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    handleAddressChange({
      ...formData.address,
      province: provinceId,
      department: '',
      city: '',
    });
    if (provinceId) {
      const deps = await getDepartmentsByProvince(provinceId);
      setDepartments(deps || []);
      setCities([]);
    } else {
      setDepartments([]);
      setCities([]);
    }
  };

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    handleAddressChange({
      ...formData.address,
      department: departmentId,
      city: '',
    });
    if (departmentId) {
      const cits = await getCitiesByDepartment(departmentId);
      setCities(cits || []);
    } else {
      setCities([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    if (imageFile) data.append('profile_image', imageFile);
    data.append('description', formData.description);
    data.append('phone_number', formData.phone_number);
    data.append('type_provider', formData.type_provider);
    data.append('profession', formData.profession);
    if (formData.categories?.length > 0) {
      formData.categories.forEach(catId => data.append('categories', catId));
    }
    if (formData.address) {
      data.append('address', JSON.stringify(formData.address));
    }

    try {
      const res = await profileService.updateProfile(data);
      setProfile(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
    }
  };

  // ===============================
  // 🔹 Renderizado del componente
  // ===============================

  if (!profile) return null;

  const { user, profile: profileDetails } = profile;
  const address = profileDetails?.address;
  const fullAddress = address
    ? `${address.street || ''} ${address.number || ''}, ${address.city_detail?.name || ''} - CP: ${address.postal_code || ''}`
    : 'No especificada';

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="card-body p-4">

        {/* 🔹 Vista normal */}
        {!isEditing && (
          <>
            <div className="row">
              <div className="col-md-4 text-center border-end">
                <ImageUpload
                  currentImage={user.profile_image || '/placeholder.png'}
                  disabled={true}
                />
                <h4 className="mt-3 mb-1">
                  {user.name} {user.lastname}
                </h4>
                <p className="text-muted mb-2">{user.email}</p>
              </div>

              <div className="col-md-8 ps-md-4 mt-4 mt-md-0">
                <h5 className="border-start border-3 border-primary ps-3 mb-3 fw-semibold">
                  Descripción
                </h5>
                <p>{profileDetails?.description || 'No especificada'}</p>
                <hr />
                <p><strong>Profesión:</strong> {profileDetails?.profession?.name || 'No especificada'}</p>
                <p><strong>Tipo de Proveedor:</strong> {profileDetails?.type_provider?.name || 'No especificado'}</p>
                <p><strong>Dirección:</strong> {fullAddress}</p>

                <h5 className="border-start border-3 border-primary ps-3 mt-4 mb-3 fw-semibold">
                  Categorías
                </h5>
                <div>
                  {(profileDetails?.categories || []).length > 0 ? (
                    profileDetails.categories.map((cat, i) => (
                      <span key={cat.id_category ?? i} className="badge bg-secondary me-1 mb-1">
                        {cat.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-muted">No especificadas</p>
                  )}
                </div>
              </div>
            </div>

            <div className="text-end mt-4">
              <button onClick={startEditing} className="btn btn-primary px-4 rounded-pill">
                <i className="bi bi-pencil-square me-2"></i>Editar Perfil
              </button>
            </div>
          </>
        )}

        {/* 🔹 Vista de edición */}
        {isEditing && (
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-4 text-center border-end">
                <ImageUpload
                  currentImage={profile.user.profile_image || '/placeholder.png'}
                  onFileSelect={setImageFile}
                />
              </div>

              <div className="col-md-8 ps-md-4 mt-4 mt-md-0">
                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-semibold">Descripción</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone_number" className="form-label fw-semibold">Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <hr className="my-4" />

            <h5 className="border-start border-3 border-primary ps-3 mb-3 fw-semibold">Dirección</h5>
            <AddressForm
              addressData={formData.address}
              provinces={provinces}
              departments={departments}
              cities={cities}
              onAddressChange={handleAddressChange}
              onProvinceChange={handleProvinceChange}
              onDepartmentChange={handleDepartmentChange}
            />

            <hr className="my-4" />

            <h5 className="border-start border-3 border-primary ps-3 mb-3 fw-semibold">Categorías</h5>
            <div className="d-flex flex-wrap">
              {categories.map((cat, i) => (
                <div key={cat.id_category ?? i} className="form-check form-check-inline me-3 mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`category-${cat.id_category ?? i}`}
                    value={cat.id_category}
                    checked={(formData.categories || []).includes(cat.id_category)}
                    onChange={handleCategoryChange}
                  />
                  <label className="form-check-label" htmlFor={`category-${cat.id_category ?? i}`}>
                    {cat.name}
                  </label>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="type_provider" className="form-label fw-semibold">Tipo de Proveedor</label>
                <select
                  className="form-select"
                  id="type_provider"
                  name="type_provider"
                  value={formData.type_provider}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione...</option>
                  {typeProviders.map((type, i) => (
                    <option key={type.id_type_provider ?? i} value={type.id_type_provider}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="profession" className="form-label fw-semibold">Profesión</label>
                <select
                  className="form-select"
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione...</option>
                  {professions.map((prof, i) => (
                    <option key={prof.id_profession ?? i} value={prof.id_profession}>
                      {prof.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-end mt-4">
              <button type="submit" className="btn btn-success me-2 px-4 rounded-pill">
                <i className="bi bi-check-circle me-2"></i>Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary px-4 rounded-pill"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProviderProfile;
