// components/AttachmentsGallery.jsx
const isImage = (file) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file);

const AttachmentsGallery = ({ attachments, onOpenModal }) => {
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
