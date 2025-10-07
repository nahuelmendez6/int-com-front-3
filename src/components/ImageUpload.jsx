import { useState } from 'react';

const ImageUpload = ({ currentImage, onImageChange, disabled = false }) => {
  const [preview, setPreview] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Crear preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Simular upload a servidor
      // En una aplicación real, aquí se subiría el archivo al servidor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular URL de imagen subida
      const mockImageUrl = `http://127.0.0.1:8000/media/profiles/${file.name}`;
      
      onImageChange(mockImageUrl);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Intenta nuevamente.');
      setPreview(currentImage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange('');
  };

  return (
    <div className="text-center">
      <div className="position-relative d-inline-block">
        {preview ? (
          <div className="position-relative">
            <img
              src={preview}
              alt="Imagen de perfil"
              className="rounded-circle border border-3 border-light shadow"
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'cover'
              }}
            />
            {!disabled && (
              <button
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                style={{
                  width: '25px',
                  height: '25px',
                  transform: 'translate(50%, -50%)',
                  fontSize: '0.7rem'
                }}
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        ) : (
          <div
            className="rounded-circle border border-3 border-light shadow d-flex align-items-center justify-content-center bg-light"
            style={{
              width: '120px',
              height: '120px'
            }}
          >
            <i className="bi bi-person-circle text-muted" style={{ fontSize: '3rem' }}></i>
          </div>
        )}
        
        {isUploading && (
          <div
            className="position-absolute top-50 start-50 translate-middle d-flex align-items-center justify-content-center bg-white rounded-circle border border-3 border-light shadow"
            style={{
              width: '120px',
              height: '120px'
            }}
          >
            <div className="text-center">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Subiendo...</span>
              </div>
              <div className="mt-1">
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Subiendo...</small>
              </div>
            </div>
          </div>
        )}
      </div>

      {!disabled && (
        <div className="mt-3">
          <input
            type="file"
            className="form-control d-none"
            id="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <label
            htmlFor="profileImage"
            className="btn btn-outline-primary btn-sm"
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            <i className="bi bi-camera me-1"></i>
            {preview ? 'Cambiar Imagen' : 'Subir Imagen'}
          </label>
        </div>
      )}

      <div className="mt-2">
        <small className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          JPG, PNG o GIF. Máximo 5MB
        </small>
      </div>

      {disabled && (
        <div className="mt-2">
          <small className="text-muted">
            <i className="bi bi-lock me-1"></i>
            Haz clic en "Editar Perfil" para cambiar la imagen
          </small>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
