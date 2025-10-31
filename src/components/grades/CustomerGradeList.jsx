import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import StarRating from '../common/StarRating';

const CustomerGradeList = ({ grades }) => {
  console.log(grades)
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

  return (
    <Card className="mt-4">
      <Card.Header>
        <h5 className="mb-0">Calificaciones Recibidas</h5>
      </Card.Header>
      <ListGroup variant="flush">
        {grades.map((grade) => (
          <ListGroup.Item key={grade.id_grade_customer} className="p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{grade.provider.name} {grade.provider.lastname}</strong>
                <p className="text-muted mb-1">@{grade.provider.username}</p>
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
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default CustomerGradeList;
