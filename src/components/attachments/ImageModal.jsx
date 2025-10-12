// components/ImageModal.jsx
import { Modal, Carousel, Button } from "react-bootstrap";

const ImageModal = ({ show, onHide, images, currentIndex, setCurrentIndex }) => (
  <Modal show={show} onHide={onHide} size="lg" centered>
    <Modal.Body>
      {images?.length ? (
        <Carousel activeIndex={currentIndex} onSelect={setCurrentIndex} interval={null}>
          {images.map((img, idx) => (
            <Carousel.Item key={idx}>
              <img className="d-block w-100" src={`http://127.0.0.1:8000${img.file}`} alt={`Adjunto ${idx + 1}`} />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p>No hay imágenes para mostrar.</p>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>Cerrar</Button>
    </Modal.Footer>
  </Modal>
);

export default ImageModal;
