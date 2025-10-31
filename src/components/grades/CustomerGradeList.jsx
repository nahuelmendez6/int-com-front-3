import React from 'react';
import { Card, ListGroup, Image } from 'react-bootstrap';
import StarRating from '../common/StarRating';

const CustomerGradeList = ({ grades }) => {
  const baseURL = "http://127.0.0.1:8000";

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
