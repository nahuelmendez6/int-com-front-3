import React, { useState } from "react";

const ProviderProfile = ({ userData, onUpdate }) => {
  const { user, profile } = userData;

  const [formData, setFormData] = useState({
    name: user.name || "",
    lastname: user.lastname || "",
    email: user.email || "",
    description: profile.description || "",
    profession: profile.profession?.name || "",
    type_provider: profile.type_provider?.name || "",
    categories: profile.categories?.map((c) => c.name).join(", ") || "",
    street: profile.address?.street || "",
    number: profile.address?.number || "",
    city: profile.address?.city_detail?.name || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    // 👉 acá luego harías api.put("/providers/:id", formData)
  };

  return (
    <form>
      <div className="d-flex align-items-center mb-4">
        <img
          src={user.profile_image}
          alt="Foto de perfil"
          className="rounded-circle me-3"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />
        <div>
          <h4 className="mb-1">{formData.name} {formData.lastname}</h4>
          <p className="text-muted mb-0">{formData.email}</p>
          <span className="badge bg-success">Proveedor</span>
        </div>
      </div>

      <h5 className="mb-3">Datos profesionales</h5>
      <div className="mb-3">
        <label className="form-label">Profesión</label>
        <input
          type="text"
          name="profession"
          value={formData.profession}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Tipo de proveedor</label>
        <input
          type="text"
          name="type_provider"
          value={formData.type_provider}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Categorías (separadas por coma)</label>
        <input
          type="text"
          name="categories"
          value={formData.categories}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <h6 className="mt-4">Dirección</h6>
      <div className="mb-3">
        <label className="form-label">Calle</label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Número</label>
        <input
          type="text"
          name="number"
          value={formData.number}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Ciudad</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <button type="button" className="btn btn-primary mt-3" onClick={handleSave}>
        Guardar cambios
      </button>
    </form>
  );
};

export default ProviderProfile;
