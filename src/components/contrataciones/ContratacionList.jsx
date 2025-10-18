import React from 'react';
import { Card, Row, Col, Badge, Image, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

const ContratacionList = ({ contrataciones }) => {
  const { profile } = useAuth();
  const baseURL = "http://127.0.0.1:8000";

  if (contrataciones.length === 0) {
    return <p>No tienes trabajos aprobados por el momento.</p>;
  }

  return (
    <Row>
      {contrataciones.map(item => {
        const otherUser = profile.role === 'customer' ? item.provider : item.customer;
        const profileImageUrl = otherUser.profile_image ? `${baseURL}${otherUser.profile_image}` : 'https://via.placeholder.com/150';

        return (
          <Col md={12} key={item.id_postulation} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header as="h5" className="bg-light">
                <strong>Petición:</strong> {item.petition.title}
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} className="text-center border-end">
                    <Image 
                      src={profileImageUrl} 
                      roundedCircle 
                      fluid 
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
                      alt={`Foto de perfil de ${otherUser.name}`}
                    />
                    <h6 className="mt-3 mb-1">{`${otherUser.name} ${otherUser.lastname}`}</h6>
                    {otherUser.profession && <p className="text-muted small">{otherUser.profession}</p>}
                     <p className="mt-2"> 
                      <strong>
                        {profile.role === 'customer' ? 'Proveedor' : 'Cliente'}
                      </strong>
                    </p>
                  </Col>
                  <Col md={9}>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <h6 className="mb-1">Propuesta aceptada:</h6>
                        <p className="mb-1 fst-italic">"{item.proposal}"</p>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">Precio Final Acordado:</h6>
                          <Badge bg="success" pill className="p-2 fs-6">
                            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.final_price)}
                          </Badge>
                        </div>
                        <div className="text-end">
                           <h6 className="mb-1">Fecha de Aprobación:</h6>
                           <small className="text-muted">
                            {new Date(item.approved_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </small>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ContratacionList;

