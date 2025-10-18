import React from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? '#ffc107' : '#e4e5e9', fontSize: '1.2rem' }}>
        ★
      </span>
    );
  }
  return <div>{stars}</div>;
};

const GradeList = ({ grades }) => {
  const baseURL = "http://127.0.0.1:8000";

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
                <p className="mt-2 mb-0 fw-bold">{`${grade.customer.first_name} ${grade.customer.last_name}`}</p>
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
