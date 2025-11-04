// src/components/ConfirmationModal.jsx
// =====================================================
// Componente: ConfirmationModal
// -----------------------------------------------------
// Modal reutilizable para confirmar acciones críticas.
// Se utiliza principalmente para confirmar eliminaciones,
// cancelaciones o cualquier acción irreversible.
//
// Muestra un título, un cuerpo descriptivo y dos botones:
//  - "Cancelar" para cerrar el modal sin realizar la acción.
//  - "Confirmar" para ejecutar la acción deseada.
//
// Usa el componente Modal de React-Bootstrap para su diseño.
// =====================================================

import React from 'react';
import { Modal, Button } from 'react-bootstrap';


/**
 * Modal de confirmación genérico y reutilizable.
 *
 * Permite confirmar o cancelar acciones importantes dentro de la aplicación,
 * como eliminar un registro o modificar información sensible.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.show - Controla la visibilidad del modal.
 * @param {() => void} props.onHide - Función que se ejecuta al cerrar el modal.
 * @param {() => void} props.onConfirm - Función que se ejecuta al confirmar la acción.
 * @param {string} props.title - Título que se muestra en la cabecera del modal.
 * @param {string|JSX.Element} props.body - Contenido o mensaje principal del modal.
 *
 * @returns {JSX.Element} Un modal centrado con botones de confirmación y cancelación.
 *
 * @example
 * // Ejemplo de uso dentro de un componente
 * <ConfirmationModal
 *   show={showModal}
 *   onHide={() => setShowModal(false)}
 *   onConfirm={handleDelete}
 *   title="Confirmar eliminación"
 *   body="¿Estás seguro de que deseas eliminar este elemento?"
 * />
 */
const ConfirmationModal = ({ show, onHide, onConfirm, title, body }) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationModal;
