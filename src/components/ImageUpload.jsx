import { useState, useEffect } from 'react';

const ImageUpload = ({ currentImage, onFileSelect, disabled = false }) => {
  const [preview, setPreview] = useState(currentImage);
  const [inputId] = useState(() => `profileImage-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    setPreview(URL.createObjectURL(file)); // preview rápido
    onFileSelect(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div className="text-center">
      <div className="position-relative d-inline-block">
        {preview ? (
          <img
            src={preview}
            alt="Imagen de perfil"
            className="rounded-circle border border-3 border-light shadow"
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
        ) : (
          <div
            className="rounded-circle border border-3 border-light shadow d-flex align-items-center justify-content-center bg-light"
            style={{ width: '120px', height: '120px' }}
          >
            <i className="bi bi-person-circle text-muted" style={{ fontSize: '3rem' }}></i>
          </div>
        )}

        {!disabled && (
          <div className="mt-3">
            <input
              type="file"
              className="form-control d-none"
              id={inputId}
              accept="image/*"
              onChange={handleFileChange}
            />
            <label htmlFor={inputId} className="btn btn-outline-primary btn-sm">
              <i className="bi bi-camera me-1"></i>
              {preview ? 'Cambiar Imagen' : 'Subir Imagen'}
            </label>
            {preview && (
              <button type="button" className="btn btn-outline-danger btn-sm ms-2" onClick={handleRemoveImage}>
                <i className="bi bi-trash"></i> Eliminar
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-2">
        <small className="text-muted">
          JPG, PNG o GIF. Máximo 5MB
        </small>
      </div>
    </div>
  );
};

export default ImageUpload;
