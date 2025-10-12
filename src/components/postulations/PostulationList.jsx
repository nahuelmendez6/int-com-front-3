// components/PostulationsList.jsx
import { Alert, Badge, Card } from "react-bootstrap";

const PostulationsList = ({ postulations, loading, error }) => {
  if (loading) return <p>Cargando postulaciones...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!postulations?.length) return <Alert variant="info">No hay postulaciones para esta petición.</Alert>;

  return (
    <Card className="mt-3">
      <Card.Header>Postulaciones</Card.Header>
      <Card.Body>
        {postulations.map((post) => (
          <div key={post.id_postulation} className="mb-4 border-bottom pb-3">
            <div className="d-flex justify-content-between">
              <h6>Proveedor #{post.id_provider}</h6>
              <Badge pill bg={post.winner ? "success" : "secondary"}>
                {post.winner ? "Ganador" : "Pendiente"}
              </Badge>
            </div>
            <p>{post.proposal}</p>

            {post.budgets?.length > 0 && (
              <div>
                <strong>Presupuesto:</strong>
                <ul>
                  {post.budgets.map((b) => (
                    <li key={b.id_budget}>{b.cost_type}: {b.amount || b.unit_price}</li>
                  ))}
                </ul>
              </div>
            )}

            {post.materials?.length > 0 && (
              <div>
                <strong>Materiales:</strong>
                <ul>
                  {post.materials.map((m) => (
                    <li key={m.id_postulation_material}>{m.id_material} - Cant: {m.quantity}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};

export default PostulationsList;
