// src/components/ConfirmationModal.jsx
// =====================================================
// Componente: ConfirmationModal
// -----------------------------------------------------
// Modal genérico de confirmación utilizado en distintas
// partes de la aplicación para pedir al usuario que confirme
// una acción importante (por ejemplo, eliminar un registro).
//
// Este componente:
//  - Muestra un mensaje de advertencia o confirmación.
//  - Permite cancelar o aceptar la acción.
//  - Es completamente reutilizable.
//
// Basado en componentes de React Bootstrap.
// =====================================================

import React from 'react';
import { Modal, Button } from 'react-bootstrap';


/**
 * Muestra un modal de confirmación con botones de acción
 * para aceptar o cancelar una operación.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.show - Controla la visibilidad del modal.
 * @param {Function} props.onHide - Función llamada al cerrar el modal sin confirmar.
 * @param {Function} props.onConfirm - Función ejecutada al confirmar la acción.
 * @param {string} props.title - Título del modal (por ejemplo, "Confirmar eliminación").
 * @param {string|React.ReactNode} props.body - Contenido principal del modal (mensaje o JSX).
 *
 * @example
 * <ConfirmationModal
 *   show={showModal}
 *   onHide={() => setShowModal(false)}
 *   onConfirm={handleDelete}
 *   title="Eliminar registro"
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
