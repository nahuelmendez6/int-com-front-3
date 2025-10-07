import React, { useState } from "react";

const CustomerProfile = ({ userData, onUpdate }) => {
  const { user, profile } = userData;

  const [formData, setFormData] = useState({
    name: user.name || "",
    lastname: user.lastname || "",
    email: user.email || "",
    dni: profile.dni || "",
    phone: profile.phone || "",
    street: profile.address?.street || "",
    number: profile.address?.number || "",
    city: profile.address?.city_detail?.name || "",
    postal_code: profile.address?.postal_code || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    // 👉 acá luego harías api.put("/customers/:id", formData)
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
          <span className="badge bg-primary">Cliente</span>
        </div>
      </div>

      <h5 className="mb-3">Datos de cliente</h5>
      <div className="mb-3">
        <label className="form-label">DNI</label>
        <input
          type="text"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Teléfono</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
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
      <div className="mb-3">
        <label className="form-label">Código Postal</label>
        <input
          type="text"
          name="postal_code"
          value={formData.postal_code}
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

export default CustomerProfile;
