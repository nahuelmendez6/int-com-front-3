// src/components/grades/GradeList.jsx
// =====================================================
// Componente: GradeList
// -----------------------------------------------------
// Muestra las calificaciones que un proveedor ha recibido por parte de sus clientes.
// Cada calificación incluye información del cliente, su comentario, la valoración
// mediante estrellas (StarRating), la fecha de la calificación y una posible respuesta.
//
// Dependencias:
//  - React-Bootstrap (Card, Row, Col, Image)
// =====================================================

import React from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';


// =====================================================
// Subcomponente: StarRating
// -----------------------------------------------------
// Representa visualmente una calificación con estrellas (1 a 5).
// Las estrellas se pintan de color dorado según la puntuación recibida.
//
// @param {Object} props
// @param {number} props.rating - Valor numérico de la calificación (1 a 5).
// =====================================================
const StarRating = ({ rating }) => {
  const stars = [];

  // Renderiza las 5 estrellas, marcando las que estén dentro del valor de "rating"
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? '#ffc107' : '#e4e5e9', fontSize: '1.2rem' }}>
        ★
      </span>
    );
  }
  return <div>{stars}</div>;
};


// =====================================================
// Componente principal: GradeList
// -----------------------------------------------------
// Renderiza una lista de calificaciones recibidas por un proveedor.
// Si no hay calificaciones, muestra un mensaje informativo.
//
// @param {Object} props
// @param {Array} props.grades - Lista de calificaciones del proveedor.
//
// Cada elemento del array `grades` tiene la forma:
// {
//   id: number,
//   rating: number,
//   coment: string,
//   response?: string,
//   date_create: string,
//   customer: {
//     name: string,
//     lastname: string,
//     profile_image?: string
//   }
// }
//
// @example
// <GradeList grades={providerGrades} />
// =====================================================
const GradeList = ({ grades }) => {
  const baseURL = "http://127.0.0.1:8000";
  console.log(grades)

  if (!grades || grades.length === 0) {
    return <p>Este proveedor aún no tiene calificaciones.</p>;
  }

  return (
    <div className="grades-section">
      <h3 className="mb-4">Calificaciones de Clientes</h3>
      {grades.map(grade => (
        <Card key={grade.id} className="mb-3 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={2} className="text-center">
                <Image
                  src={grade.customer.profile_image ? `${baseURL}${grade.customer.profile_image}` : 'https://via.placeholder.com/80'}
                  roundedCircle
                  fluid
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  alt={`Foto de ${grade.customer.first_name}`}
                />
                <p className="mt-2 mb-0 fw-bold">{`${grade.customer.name} ${grade.customer.lastname}`}</p>
              </Col>
              <Col md={10}>
                <div className="d-flex justify-content-between">
                  <StarRating rating={grade.rating} />
                  <small className="text-muted">
                    {new Date(grade.date_create).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </small>
                </div>
                <p className="mt-2 fst-italic">"{grade.coment}"</p>
                {grade.response && (
                  <div className="p-2 mt-2 rounded" style={{ backgroundColor: '#f0f0f0' }}>
                    <strong>Respuesta del proveedor:</strong>
                    <p className="mb-0 fst-italic">"{grade.response}"</p>
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default GradeList;
