import React, { useState, useEffect } from 'react';
import PortfolioList from '../components/portfolio/PortfolioList';
import PortfolioForm from '../components/portfolio/PortfolioForm';
import MaterialList from '../components/portfolio/MaterialList';
import MaterialForm from '../components/portfolio/MaterialForm';
import portfolioService from '../services/portfolio.service';
import materialService from '../services/material.service';
import { Button, Modal, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

const PortfolioPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');
  
  const { profile } = useAuth();

  const fetchPortfolios = async () => {
    try {
      if (profile?.profile?.id_provider) {
        setLoading(true);
        const response = await portfolioService.getPortfoliosByProvider(profile.profile.id_provider);
        setPortfolios(response.data);
        setError(null);
      } else {
        setPortfolios([]);
      }
    } catch (err) {
      setError('Error al cargar el portfolio.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      if (profile?.profile?.id_provider) {
        const response = await materialService.getMaterials(profile.profile.id_provider);
        setMaterials(response.data);
      }
    } catch (err) {
      console.error('Error al cargar los materiales:', err);
    }
  };

  useEffect(() => {
    fetchPortfolios();
    fetchMaterials();
  }, [profile]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  
  const handleShowMaterialModal = () => setShowMaterialModal(true);
  const handleCloseMaterialModal = () => setShowMaterialModal(false);

  const handleSuccess = () => {
    fetchPortfolios();
    handleCloseModal();
  };

  const handleMaterialSuccess = () => {
    fetchMaterials();
    handleCloseMaterialModal();
  };

  if (loading) {
    return (
      <div className="portfolio-page">
        <div className="card shadow rounded-3">
          <div className="card-body p-4">
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando portfolio...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-page">
        <div className="card shadow rounded-3">
          <div className="card-body p-4">
            <div className="alert alert-danger d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="card-title mb-0">
              <i className="bi bi-briefcase me-2"></i>
              Mi Portfolio
            </h1>
            <div className="d-flex gap-2">
              {activeTab === 'portfolio' && (
                <Button variant="primary" className="btn-social btn-primary-social" onClick={handleShowModal}>
                  <i className="bi bi-plus-lg me-2"></i>
                  Crear Nuevo Proyecto
                </Button>
              )}
              {activeTab === 'materials' && (
                <Button variant="success" className="btn-social btn-success-social" onClick={handleShowMaterialModal}>
                  <i className="bi bi-plus-lg me-2"></i>
                  Agregar Material
                </Button>
              )}
            </div>
          </div>
          
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="portfolio" title={
              <span>
                <i className="bi bi-briefcase me-2"></i>
                Proyectos
              </span>
            }>
              <p className="text-muted mb-4">
                Muestra tu trabajo y experiencia a través de proyectos que demuestren tus habilidades y servicios.
              </p>
              <PortfolioList portfolios={portfolios} refreshPortfolios={fetchPortfolios} />
            </Tab>
            
            <Tab eventKey="materials" title={
              <span>
                <i className="bi bi-box-seam me-2"></i>
                Catálogo de Productos
              </span>
            }>
              <p className="text-muted mb-4">
                Gestiona tu catálogo de materiales y productos. Los clientes podrán ver tus productos disponibles y sus precios.
              </p>
              <MaterialList 
                materials={materials} 
                refreshMaterials={fetchMaterials}
                providerId={profile?.profile?.id_provider}
              />
            </Tab>
          </Tabs>

          {/* Portfolio Modal */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Nuevo Proyecto de Portfolio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PortfolioForm onSuccess={handleSuccess} />
            </Modal.Body>
          </Modal>

          {/* Material Modal */}
          <Modal show={showMaterialModal} onHide={handleCloseMaterialModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Nuevo Material/Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <MaterialForm 
                onSuccess={handleMaterialSuccess}
                providerId={profile?.profile?.id_provider}
              />
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
