// src/components/customer/CustomerGradeList.jsx
// =====================================================
// Componente: CustomerGradeList
// -----------------------------------------------------
// Muestra el listado de calificaciones recibidas por un cliente.
// Cada calificación incluye la información del proveedor, la puntuación
// (mediante el componente StarRating), comentarios y posibles respuestas.
//
// Dependencias:
//  - React-Bootstrap (Card, ListGroup, Image)
//  - StarRating: componente que representa estrellas de valoración
// =====================================================

import React from 'react';
import { Card, ListGroup, Image } from 'react-bootstrap';
import StarRating from '../common/StarRating';

/**
 * Renderiza la lista de calificaciones asociadas a un cliente.
 * Si el cliente aún no recibió calificaciones, muestra un mensaje informativo.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.grades - Lista de calificaciones recibidas por el cliente.
 *
 * Cada elemento del array `grades` tiene la forma:
 * {
 *   id_grade_customer: number,
 *   provider: { name: string, lastname: string, profile_image: string },
 *   rating: number,
 *   comment?: string,
 *   response?: string,
 *   date_create: string
 * }
 *
 * @example
 * <CustomerGradeList grades={customerGrades} />
 */
const CustomerGradeList = ({ grades }) => {
  const baseURL = "http://127.0.0.1:8000";

  // --- Caso: no hay calificaciones registradas ---
  if (!grades || grades.length === 0) {
    return (
      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Calificaciones</h5>
        </Card.Header>
        <Card.Body>
          <p className="text-muted">Este cliente aún no ha recibido ninguna calificación.</p>
        </Card.Body>
      </Card>
    );
  }

  // --- Renderizado principal: listado de calificaciones ---
  return (
    <Card className="mt-4">
      <Card.Header>
        <h5 className="mb-0">Calificaciones Recibidas</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {grades.map((grade) => (
          <ListGroup.Item key={grade.id_grade_customer} className="p-3">
            <div className="d-flex">
              <Image
                src={`${baseURL}${grade.provider.profile_image}`}
                roundedCircle
                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }}
              />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{grade.provider.name} {grade.provider.lastname}</strong>
                  </div>
                  <div className="text-end">
                    <StarRating rating={grade.rating} readOnly />
                    <small className="text-muted ms-2">
                      {new Date(grade.date_create).toLocaleDateString('es-ES')}
                    </small>
                  </div>
                </div>
                {grade.comment && <p className="mt-2 mb-0 fst-italic">"{grade.comment}"</p>}
                {grade.response && (
                  <div className="mt-2 p-2 bg-light rounded">
                    <strong>Respuesta del cliente:</strong>
                    <p className="mb-0 fst-italic">"{grade.response}"</p>
                  </div>
                )}
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default CustomerGradeList;
