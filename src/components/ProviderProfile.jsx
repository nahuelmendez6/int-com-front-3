import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service.js';
import {
  getProvinces,
  getDepartmentsByProvince,
  getCitiesByDepartment
} from '../services/location.service.js';
import AddressForm from './AddressForm.jsx';
import ImageUpload from './ImageUpload.jsx';
import './ProviderProfile.css';
import useAverageRating from '../hooks/useAverageRating';
import StarRating from './common/StarRating';
import gradesService from '../services/grades.service.js';
import GradeList from './grades/GradeList.jsx';

const ProviderProfile = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userData);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  console.log(userData)
  // Obtener id_user del usuario para las calificaciones
  const userId = userData?.user?.id_user || userData?.user?.id;
  const { averageRating, loading: loadingRating, error: errorRating } = useAverageRating(userId);
  const [grades, setGrades] = useState([]);

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

        setCategories(catRes|| []);
        setTypeProviders(typeProvRes || []);
        setProfessions(profRes|| []);
        setProvinces(provRes || []);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      if (userId) {
        try {
          const gradesData = await gradesService.getGradesByUserId(userId);
          setGrades(gradesData.results || gradesData || []);
        } catch (err) {
          console.error('Error fetching grades:', err);
          setGrades([]);
        }
      }
    };
    fetchGrades();
  }, [userId]);

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
    <div className="social-card provider-profile-container">
      <div className="card-body p-3 p-md-4">

        {/* 🔹 Vista normal */}
        {!isEditing && (
          <>
            <div className="row g-3">
              {/* Imagen y datos básicos */}
              <div className="col-12 col-md-4 text-center border-end border-md-end-0">
                <ImageUpload
                  currentImage={user.profile_image || '/placeholder.png'}
                  disabled
                  className="img-fluid rounded-circle mb-3"
                />
                <h4 className="mb-1">
                  {user.name} {user.lastname}
                  {averageRating !== null && !loadingRating && (
                    <span className="ms-2">
                      <StarRating rating={averageRating} />
                    </span>
                  )}
                </h4>
                <p className="text-muted mb-2">{user.email}</p>
              </div>

              <div className="col-12 col-md-8 ps-md-4">
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
                      <span key={cat.id_category ?? i} className="badge badge-social bg-primary me-1 mb-1">
                        <i className="bi bi-tag me-1"></i>
                        {cat.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-muted">No especificadas</p>
                  )}
                </div>
              </div>
            </div>

            <hr />
            <h5 className="border-start border-3 border-primary ps-3 mt-4 mb-3 fw-semibold">
              Calificaciones
            </h5>
            <GradeList grades={grades} />

            <div className="d-grid d-md-flex justify-content-md-end mt-4 gap-2">
              <button onClick={startEditing} className="btn btn-social btn-primary-social">
                <i className="bi bi-pencil-square me-2"></i>Editar Perfil
              </button>
            </div>
          </>
        )}

        {/* 🔹 Vista de edición */}
        {isEditing && (
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-4 text-center border-end border-md-end-0">
                <ImageUpload
                  currentImage={profile.user.profile_image || '/placeholder.png'}
                  onFileSelect={setImageFile}
                  className="img-fluid rounded-circle mb-3"
                />
              </div>

              <div className="col-12 col-md-8 ps-md-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea
                    className="form-control form-control-social"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Teléfono</label>
                  <input
                    type="text"
                    className="form-control form-control-social"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <hr className="my-3" />

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

            <hr className="my-3" />

            <h5 className="border-start border-3 border-primary ps-3 mb-3 fw-semibold">Categorías</h5>
                <div className="d-flex flex-column flex-md-row flex-wrap">
              {categories.map((cat, i) => (
                <div key={cat.id_category ?? i} className="form-check me-3 mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`category-${cat.id_category ?? i}`}
                    value={cat.id_category}
                    checked={(formData.categories || []).includes(cat.id_category)}
                    onChange={handleCategoryChange}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <label className="form-check-label fw-semibold" htmlFor={`category-${cat.id_category ?? i}`}>
                    {cat.name}
                  </label>
                </div>
              ))}
            </div>

            <hr className="my-3" />

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Tipo de Proveedor</label>
                <select
                  className="form-select form-control-social w-100"
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

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Profesión</label>
                <select
                  className="form-select form-control-social w-100"
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

            <div className="d-grid d-md-flex justify-content-md-end gap-2 mt-4">
              <button type="submit" className="btn btn-social btn-success-social">
                <i className="bi bi-check-circle me-2"></i>Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-social btn-secondary"
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