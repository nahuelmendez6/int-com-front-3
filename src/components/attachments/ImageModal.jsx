// components/ImageModal.jsx

// components/ImageModal.jsx
// =====================================================
// Componente: ImageModal
// -----------------------------------------------------
// Modal visual para mostrar imágenes en carrusel (slideshow).
// Permite al usuario visualizar y navegar entre los adjuntos
// seleccionados dentro de una galería.
// -----------------------------------------------------
// Tecnologías:
//  - React Bootstrap (Modal, Carousel, Button)
//  - Props controladas para apertura, cierre y navegación
// =====================================================

import { Modal, Carousel, Button } from "react-bootstrap";

/**
 * Modal de visualización de imágenes adjuntas.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.show - Controla la visibilidad del modal.
 * @param {Function} props.onHide - Función para cerrar el modal.
 * @param {Object[]} props.images - Lista de imágenes a mostrar.
 * @param {string} props.images[].file - Ruta del archivo de imagen en el servidor.
 * @param {number} props.currentIndex - Índice de la imagen actualmente visible.
 * @param {Function} props.setCurrentIndex - Función para actualizar el índice actual.
 *
 * @example
 * <ImageModal
 *   show={isOpen}
 *   onHide={() => setIsOpen(false)}
 *   images={[
 *     { file: '/media/uploads/foto1.jpg' },
 *     { file: '/media/uploads/foto2.jpg' }
 *   ]}
 *   currentIndex={0}
 *   setCurrentIndex={setIndex}
 * />
 */
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
