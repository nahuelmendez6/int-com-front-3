// components/AttachmentsGallery.jsx
// =====================================================
// Componente: AttachmentsGallery
// -----------------------------------------------------
// Muestra una galería de archivos adjuntos asociados a una entidad
// (por ejemplo, portfolios, ofertas o peticiones).
// - Si el archivo es una imagen, se renderiza en miniatura.
// - Si no lo es, se muestra un ícono representativo del archivo.
// Al hacer clic, se activa un modal de vista ampliada.
// =====================================================

/**
 * Verifica si un archivo tiene una extensión de imagen válida.
 *
 * @function isImage
 * @param {string} file - Nombre o ruta del archivo.
 * @returns {boolean} `true` si el archivo es una imagen, de lo contrario `false`.
 *
 * @example
 * isImage("foto.png"); // true
 * isImage("documento.pdf"); // false
 */
const isImage = (file) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file);


/**
 * Galería de adjuntos visual.
 *
 * @component
 * @param {Object[]} attachments - Lista de archivos adjuntos.
 * @param {string} attachments[].file - Ruta del archivo en el servidor.
 * @param {Function} onOpenModal - Callback ejecutado al hacer clic sobre un adjunto.
 *
 * @example
 * <AttachmentsGallery
 *   attachments={[
 *     { file: '/media/uploads/foto1.jpg' },
 *     { file: '/media/docs/manual.pdf' },
 *   ]}
 *   onOpenModal={(attachments, index) => setModal({ open: true, attachments, index })}
 * />
 */
const AttachmentsGallery = ({ attachments, onOpenModal }) => {
  // Si no hay adjuntos, no renderiza nada
  if (!attachments?.length) return null;

  return (
    <div className="attachments mt-3 d-flex flex-wrap">
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="me-2 mb-2 text-center"
          style={{ maxWidth: "150px", cursor: "pointer" }}
          onClick={() => onOpenModal(attachments, index)}
        >
          {isImage(attachment.file) ? (
            <img
              src={`http://127.0.0.1:8000${attachment.file}`}
              alt={`Adjunto ${index + 1}`}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "150px", objectFit: "cover" }}
            />
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center border rounded p-2" style={{ height: "150px", width: "150px" }}>
              <i className="bi bi-file-earmark-text" style={{ fontSize: "2rem" }}></i>
              <small className="text-truncate">{attachment.file.split("/").pop()}</small>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttachmentsGallery;
