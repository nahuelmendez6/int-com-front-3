import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service.js';
import { getProvinces, getDepartmentsByProvince, getCitiesByDepartment } from '../services/location.service.js';
import AddressForm from './AddressForm.jsx';
import ImageUpload from './ImageUpload.jsx';

const ProviderProfile = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userData);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  // Profile options
  const [categories, setCategories] = useState([]);
  const [typeProviders, setTypeProviders] = useState([]);
  const [professions, setProfessions] = useState([]);

  // Location options
  const [provinces, setProvinces] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);

  console.log(userData)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, typeProvRes, profRes, provRes] = await Promise.all([
          profileService.getCategories(),
          profileService.getTypeProviders(),
          profileService.getProfessions(),
          getProvinces(),
        ]);
        setCategories(catRes.data || []);
        setTypeProviders(typeProvRes.data || []);
        setProfessions(profRes.data || []);
        setProvinces(provRes || []);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  const startEditing = () => {
    setFormData({
      description: profile.profile.description || '',
      phone_number: profile.profile.phone_number || '',
      categories: (profile.profile.categories || []).map(c => c.id_category),
      type_provider: profile.profile.type_provider?.id_type_provider || '',
      profession: profile.profile.profession?.id_profession || '',
      address: profile.profile.address || {},
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
      let updatedCategories = prev.categories || [];
      if (checked) updatedCategories = [...updatedCategories, categoryId];
      else updatedCategories = updatedCategories.filter(id => id !== categoryId);
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleAddressChange = (address) => {
    setFormData(prev => ({ ...prev, address }));
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    handleAddressChange({ ...formData.address, province: provinceId, department: '', city: '' });
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
    handleAddressChange({ ...formData.address, department: departmentId, city: '' });
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
    console.log(imageFile)
    data.append('description', formData.description);
    data.append('phone_number', formData.phone_number);
    data.append('type_provider', formData.type_provider);
    data.append('profession', formData.profession);
    if (formData.categories?.length > 0) {
      formData.categories.forEach(catId => data.append('categories', catId));
    } else {
      data.append('categories', '');
    }
    if (formData.address) data.append('address', JSON.stringify(formData.address));

    try {
      const res = await profileService.updateProfile(data);
      setProfile(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  if (!isEditing) {
    const { user, profile: profileDetails } = profile;
    const address = profileDetails.address;
    const fullAddress = address
      ? `${address.street || ''} ${address.number || ''}, ${address.floor || ''} ${address.apartment || ''} - ${address.city_detail?.name || ''}, CP: ${address.postal_code || ''}`
      : 'No especificada';

    return (
      <div>
        <div className="row">
          <div className="col-md-4 text-center">
            <ImageUpload currentImage={userData.user.profile_image || '/placeholder.png'} disabled={true} />
            <h4 className="mt-3">{userData.user.name} {userData.user.lastname}</h4>
            <p className="text-muted">{userData.user.email}</p>
          </div>
          <div className="col-md-8">
            <h5>Descripción</h5>
            <p>{profileDetails.description || 'No especificada'}</p>
            <hr />
            <p><strong>Profesión:</strong> {profileDetails.profession?.name || 'No especificada'}</p>
            <p><strong>Tipo de Proveedor:</strong> {profileDetails.type_provider?.name || 'No especificado'}</p>
            <p><strong>Dirección:</strong> {fullAddress}</p>
            <h5>Categorías</h5>
            <div>
              {(profileDetails.categories || []).map((cat, index) => (
                <span key={cat.id_category ?? index} className="badge bg-secondary me-1">{cat.name}</span>
              ))}
            </div>
          </div>
        </div>
        <button onClick={startEditing} className="btn btn-primary mt-4">Editar Perfil</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row mb-3">
        <div className="col-md-4 text-center">
          <ImageUpload
            currentImage={profile.user.profile_image || '/placeholder.png'}
            onFileSelect={setImageFile}
          />
        </div>
        <div className="col-md-8">
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Descripción</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">Teléfono</label>
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

      <AddressForm
        addressData={formData.address}
        provinces={provinces}
        departments={departments}
        cities={cities}
        onAddressChange={handleAddressChange}
        onProvinceChange={handleProvinceChange}
        onDepartmentChange={handleDepartmentChange}
      />

      <div className="mb-3">
        <label className="form-label">Categorías</label>
        <div className="d-flex flex-wrap">
          {categories.map((category, index) => (
            <div key={category.id_category ?? index} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id={`category-${category.id_category ?? index}`}
                value={category.id_category}
                checked={(formData.categories || []).includes(category.id_category)}
                onChange={handleCategoryChange}
              />
              <label className="form-check-label" htmlFor={`category-${category.id_category ?? index}`}>{category.name}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="type_provider" className="form-label">Tipo de Proveedor</label>
        <select
          className="form-select"
          id="type_provider"
          name="type_provider"
          value={formData.type_provider}
          onChange={handleInputChange}
        >
          <option value="">Seleccione...</option>
          {typeProviders.map((type, index) => (
            <option key={type.id_type_provider ?? index} value={type.id_type_provider}>{type.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="profession" className="form-label">Profesión</label>
        <select
          className="form-select"
          id="profession"
          name="profession"
          value={formData.profession}
          onChange={handleInputChange}
        >
          <option value="">Seleccione...</option>
          {professions.map((prof, index) => (
            <option key={prof.id_profession ?? index} value={prof.id_profession}>{prof.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-success me-2 mt-3">Guardar Cambios</button>
      <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary mt-3">Cancelar</button>
    </form>
  );
};

export default ProviderProfile;
