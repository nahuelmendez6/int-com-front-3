import { Alert, Badge, Card, Image, ListGroup, Row, Col } from "react-bootstrap";

const PostulationsList = ({ postulations, loading, error }) => {
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

  return (
    <Card className="mt-3">
      <Card.Header as="h5">Postulaciones</Card.Header>
      <ListGroup variant="flush">
        {postulations.map((post) => (
          <ListGroup.Item key={post.id_postulation} className="p-3">
            <Row className="align-items-center mb-3">
              <Col xs="auto">
                {post.provider_user?.profile_image ? (
                  <Image
                    src={`${API_URL}${post.provider_user.profile_image}`}
                    roundedCircle
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '50px', height: '50px' }} className="bg-secondary rounded-circle"></div>
                )}
              </Col>
              <Col>
                <h6 className="mb-0">
                  {post.provider_user ? `${post.provider_user.name} ${post.provider_user.lastname}` : `Proveedor #${post.id_provider}`}
                </h6>
                <small className="text-muted">{post.provider_user?.email}</small>
              </Col>
              <Col xs="auto">
                <Badge pill bg={post.winner ? "success" : "secondary"} style={{ fontSize: '0.9em' }}>
                  {post.winner ? "Ganador" : "Pendiente"}
                </Badge>
              </Col>
            </Row>

            <Card border="light" className="bg-light">
              <Card.Body>
                <Card.Title as="h6">Propuesta</Card.Title>
                <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{post.proposal}</Card.Text>

                {post.budgets?.length > 0 && (
                  <div className="mt-3">
                    <strong>Presupuesto</strong>
                    <ListGroup variant="flush" className="mt-1">
                      {post.budgets.map((b) => (
                        <ListGroup.Item key={b.id_budget} className="d-flex justify-content-between bg-transparent">
                          <span>{budgetTypeMap[b.cost_type] || b.cost_type}</span>
                          <strong>${new Intl.NumberFormat('es-AR').format(b.amount || b.unit_price)}</strong>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}

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
              </Card.Body>
            </Card>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default PostulationsList;
