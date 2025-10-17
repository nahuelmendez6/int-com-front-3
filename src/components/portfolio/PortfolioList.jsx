import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import portfolioService from '../../services/portfolio.service';

const PortfolioList = ({ portfolios, refreshPortfolios }) => {

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await portfolioService.deletePortfolio(id);
        refreshPortfolios();
      } catch (error) {
        console.error('Error al eliminar el proyecto', error);
        alert('No se pudo eliminar el proyecto.');
      }
    }
  };

  if (!portfolios || portfolios.length === 0) {
    return <p>Aún no has añadido ningún proyecto a tu portfolio.</p>;
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {portfolios.map((portfolio) => (
        <Col key={portfolio.id_portfolio}>
          <Card>
            <Card.Body>
              <Card.Title>{portfolio.name}</Card.Title>
              <Card.Text>{portfolio.description}</Card.Text>
              <Link to={`/portfolio/${portfolio.id_portfolio}`}>
                <Button variant="info" size="sm" className="me-2">Ver Detalles</Button>
              </Link>
              <Button variant="danger" size="sm" onClick={() => handleDelete(portfolio.id_portfolio)}>
                Eliminar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PortfolioList;
