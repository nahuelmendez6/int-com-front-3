import React from 'react';

import Sidebar from '../components/Sidebar';

import { Container, Row, Col } from 'react-bootstrap';
import ProviderServiceArea from '../components/provider-location/ProviderServiceArea.jsx';
import { useAuth } from '../hooks/useAuth.js';

const ServiceAreaPage = () => {
    const { profile } = useAuth();
    const id_provider = profile?.profile?.id_provider;


    return (
        <div className="min-vh-100 bg-light">
            <Sidebar />
            <div 
                className="container-fluid main-content"
                style={{
                paddingTop: '10px',
                paddingLeft: '280px',
                paddingRight: '10px',
                }}
            >
            <Row>
                <Col>
                    <h1>Área de Servicio</h1>
                    <ProviderServiceArea providerId={id_provider} />
                </Col>
            </Row>
        </div>
        <style>{`
            .main-content {
                width: 100%;
                max-width: none;
                margin-left: 0;
                margin-right: 0;
            }
            @media (max-width: 767.98px) {
              .main-content {
                padding-left: 10px !important;
                padding-right: 10px !important;
                padding-top: 10px !important;
              }
            }
        `}</style>
    </div>
    );
};

export default ServiceAreaPage;