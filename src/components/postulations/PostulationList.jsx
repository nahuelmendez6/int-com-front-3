import { Accordion, Alert, Badge, Card, Image, ListGroup, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const PostulationsList = ({ postulations, loading, error, onUpdate, petitionId }) => {
  if (loading) return <p>Cargando postulaciones...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!postulations?.length) return <Alert variant="info">No hay postulaciones para esta petición.</Alert>;

  const API_URL = 'http://127.0.0.1:8000';

  const budgetTypeMap = {
    por_hora: 'Por Hora',
    por_proyecto: 'Por Proyecto',
    por_item: 'Por Ítem',
    material: 'Material',
    servicio: 'Servicio',
    mixto: 'Mixto',
  };

  const stateMap = {
    1: { variant: "success", text: "Aprobado" },
    3: { variant: "danger", text: "Rechazado" },
    4: { variant: "primary", text: "Aceptado" },
    default: { variant: "secondary", text: "Pendiente" },
  };

  return (
    <Accordion className="mt-3">
      {postulations.map((post, index) => {
        const currentState = stateMap[post.id_state] || stateMap.default;
        return (
          <Accordion.Item eventKey={index.toString()} key={post.id_postulation}>
            <Accordion.Header>
              <div className="d-flex w-100 justify-content-between align-items-center pe-3">
                <div className="d-flex align-items-center">
                  <Link to={`/provider/${post.id_provider}`} className="text-decoration-none text-dark">
                    {post.provider_user?.user?.profile_image ? (
                      <Image src={`${API_URL}${post.provider_user.user.profile_image}`} roundedCircle style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px' }} className="bg-secondary rounded-circle"></div>
                    )}
                  </Link>
                  <div className="ms-3">
                    <Link to={`/provider/${post.id_provider}`} className="text-decoration-none text-dark">
                      <h6 className="mb-0">{post.provider_user?.user?.name && post.provider_user?.user?.lastname ? `${post.provider_user.user.name} ${post.provider_user.user.lastname}` : ''}</h6>
                    </Link>
                    <small className="text-muted">{post.provider_user?.user?.email}</small>
                  </div>
                </div>
                <Badge pill bg={currentState.variant} style={{ fontSize: '0.9em' }}>
                  {currentState.text}
                </Badge>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                <Col md={7}>
                  <Card className="h-100 shadow-sm bg-light border-0">
                    <Card.Body>
                      <Card.Title as="h6"><i className="bi bi-lightbulb-fill me-2"></i>Propuesta</Card.Title>
                      <hr/>
                      <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{post.proposal}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={5}>
                  <Card className="h-100 shadow-sm bg-light border-0">
                    <Card.Body>
                      <Card.Title as="h6"><i className="bi bi-cash-coin me-2"></i>Presupuesto</Card.Title>
                      <hr/>
                      {post.budgets?.length > 0 && (
                        <ListGroup variant="flush">
                          {post.budgets.map((b) => (
                            <ListGroup.Item key={b.id_budget} className="d-flex justify-content-between bg-transparent px-1">
                              <span>{budgetTypeMap[b.cost_type] || b.cost_type}</span>
                              <strong>${new Intl.NumberFormat('es-AR').format(b.amount || b.unit_price)}</strong>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              {post.materials?.length > 0 && (
                  <div className="mt-3">
                    <strong>Materiales</strong>
                    <ListGroup variant="flush" className="mt-1">
                      {post.materials.map((m) => (
                        <ListGroup.Item key={m.id_postulation_material} className="bg-transparent">
                          {m.id_material} - Cantidad: {m.quantity}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
              )}
              <div className="mt-4 d-flex justify-content-end">
                <ButtonGroup size="sm">
                  <Button variant="outline-success" onClick={() => onUpdate(post.id_postulation, 2, petitionId)}>Aprobar</Button>
                  <Button variant="outline-danger" onClick={() => onUpdate(post.id_postulation, 3, petitionId)}>Rechazar</Button>
                  <Button variant="outline-primary" onClick={() => onUpdate(post.id_postulation, 4, petitionId)}>Aceptar</Button>
                </ButtonGroup>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};

export default PostulationsList;