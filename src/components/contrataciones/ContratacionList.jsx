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
import { Link } from 'react-router-dom';
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
  console.log('contrataciones:', contrataciones)
  return (
    <Row>
      {contrataciones.map(item => {
        const otherUser = profile.role === 'customer' ? item.provider : item.customer;
        const profileImageUrl = otherUser.profile_image ? `${baseURL}${otherUser.profile_image}` : 'https://via.placeholder.com/150';
        const isCustomer = profile.role === 'provider'; // The "other user" is the customer
        console.log('item', item)
        return (
          <Col md={12} key={item.id_postulation} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header as="h5" className="bg-light">
                <strong>Petición:</strong> {item.petition.title}
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} className="text-center border-end">
                    <Link to={profile.role === 'customer' ? `/provider/${otherUser.id}` : `/customer/${otherUser.id}`}>
                      <Image 
                        src={profileImageUrl} 
                        roundedCircle 
                        fluid 
                        style={{ width: '120px', height: '120px', objectFit: 'cover', cursor: 'pointer' }}
                        alt={`Foto de perfil de ${otherUser.name}`}
                      />
                    </Link>
                    <h6 className="mt-3 mb-1">
                      <Link 
                        to={profile.role === 'customer' ? `/provider/${otherUser.id}` : `/customer/${otherUser.id}`} 
                        className="text-dark text-decoration-none"
                      >
                        {`${otherUser.name} ${otherUser.lastname}`}
                      </Link>
                    </h6>
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
                      {(item.budget && item.budget.length > 0) && (
                        <ListGroup.Item>
                          <h6 className="mb-2">Presupuesto:</h6>
                          <div className="d-flex flex-column gap-2">
                            {item.budget.map((budget, index) => (
                              <div key={budget.id_budget || index} className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>Tipo:</strong> {budget.cost_type ? budget.cost_type.replace(/_/g, ' ') : 'N/A'}
                                </div>
                                <Badge bg="info" className="p-2">
                                  {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(
                                    parseFloat(budget.unit_price || budget.amount || 0)
                                  )}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </ListGroup.Item>
                      )}
                      {(item.materials && item.materials.length > 0) && (
                        <ListGroup.Item>
                          <h6 className="mb-2">Materiales:</h6>
                          <div className="d-flex flex-column gap-3">
                            {item.materials.map((materialItem) => {
                              const material = materialItem.material || {};
                              const unitPrice = parseFloat(materialItem.unit_price || 0);
                              const quantity = parseFloat(materialItem.quantity || 0);
                              const totalPrice = parseFloat(materialItem.total || 0);
                              
                              return (
                                <div key={materialItem.id_postulation_material} className="border rounded p-3">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="flex-grow-1">
                                      {material.name && (
                                        <div className="mb-1">
                                          <strong>Material:</strong> {material.name}
                                        </div>
                                      )}
                                      {material.description && (
                                        <div className="mb-1 text-muted small">
                                          {material.description}
                                        </div>
                                      )}
                                      <div className="mb-1">
                                        <strong>Cantidad:</strong> {quantity} {material.unit ? `(${material.unit})` : ''}
                                      </div>
                                      {material.category && (
                                        <div className="mb-1">
                                          <strong>Categoría:</strong> {material.category}
                                        </div>
                                      )}
                                      <div className="mb-1">
                                        <strong>Precio unitario:</strong>{' '}
                                        <Badge bg="primary" className="ms-1">
                                          {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(unitPrice)}
                                        </Badge>
                                      </div>
                                      <div>
                                        <strong>Total:</strong>{' '}
                                        <Badge bg="success" className="ms-1">
                                          {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalPrice)}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  {materialItem.notes && (
                                    <div className="mt-2 pt-2 border-top">
                                      <small className="text-muted">
                                        <strong>Notas:</strong> {materialItem.notes}
                                      </small>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </ListGroup.Item>
                      )}
                      <ListGroup.Item className="d-flex justify-content-between align-items-start">

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
