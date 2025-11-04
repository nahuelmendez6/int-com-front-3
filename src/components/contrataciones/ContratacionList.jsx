// src/components/ContratacionList.jsx
// =====================================================
// Componente: ContratacionList
// -----------------------------------------------------
// Renderiza una lista de contrataciones aprobadas entre
// clientes y proveedores, mostrando los datos del trabajo,
// las partes involucradas, el precio y la fecha de aprobación.
//
// Si el usuario autenticado es un cliente, también permite
// calificar al proveedor mediante el componente RatingForm.
//
// Dependencias:
//  - React y React-Bootstrap para la UI
//  - useAuth (hook personalizado para obtener datos del perfil)
//  - RatingForm (formulario de calificación)
// =====================================================

import React from 'react';
import { Card, Row, Col, Badge, Image, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import RatingForm from './RatingForm';


/**
 * Lista las contrataciones aprobadas para el usuario autenticado.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.contrataciones - Arreglo de objetos de contrataciones aprobadas.
 *
 * Cada elemento del arreglo debe contener:
 * - `id_postulation`: ID único de la contratación.
 * - `petition`: Objeto con los datos de la petición (ej. `title`).
 * - `provider`: Objeto del proveedor (nombre, apellido, imagen, profesión, etc.).
 * - `customer`: Objeto del cliente.
 * - `proposal`: Texto con la propuesta aceptada.
 * - `final_price`: Precio acordado final.
 * - `approved_at`: Fecha de aprobación del trabajo.
 *
 * @example
 * <ContratacionList contrataciones={userContrataciones} />
 */
const ContratacionList = ({ contrataciones }) => {
  const { profile } = useAuth();
  const baseURL = "http://127.0.0.1:8000";    // URL base del backend para imágenes

   // Si no hay contrataciones aprobadas, muestra un mensaje informativo.
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
                {profile.role === 'customer' && (
                  <Card.Footer className="bg-white mt-3">
                    <RatingForm providerId={item.provider.id} id_postulation={item.id_postulation} />
                  </Card.Footer>
                )}
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ContratacionList;

