import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProviderServiceArea from '../components/provider-location/ProviderServiceArea.jsx';
import { useAuth } from '../hooks/useAuth.js';

const ServiceAreaPage = () => {
    const { profile } = useAuth();
    const id_provider = profile?.profile?.id_provider;


    return (
        <div className="service-area-page">
            <Row>
                <Col>
                    <h1>Área de Servicio</h1>
                    <ProviderServiceArea providerId={id_provider} />
                </Col>
            </Row>
        </div>
    );
};

export default ServiceAreaPage;