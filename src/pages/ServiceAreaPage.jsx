import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProviderServiceArea from '../components/provider-location/ProviderServiceArea.jsx';
import { useAuth } from '../hooks/useAuth.js';

const ServiceAreaPage = () => {
    const { profile } = useAuth();
    const id_provider = profile?.profile?.id_provider;


    return (
        <div className="service-area-page">
            <div className="card shadow rounded-3">
                <div className="card-body p-4">
                    <h1 className="card-title mb-4">
                        <i className="bi bi-geo-alt me-2"></i>
                        Área de Servicio
                    </h1>
                    <p className="text-muted mb-4">
                        Define las áreas geográficas donde ofreces tus servicios. Esto ayudará a los clientes a encontrar proveedores en su zona.
                    </p>
                    <ProviderServiceArea providerId={id_provider} />
                </div>
            </div>
        </div>
    );
};

export default ServiceAreaPage;