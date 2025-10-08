import React, { useState } from 'react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

import { Container, Row, Col } from 'react-bootstrap';
import ProviderServiceArea from '../components/provider-location/ProviderServiceArea.jsx';
import ServiceAreaSection from '../components/provider-location/ServiceAreaSection.jsx';
import { useAuth }from '../hooks/useAuth.js';

const ServiceAreaPage = () => {
    const { profile } = useAuth();

    const id_provider = profile?.profile?.id_provider;

    const [editMode, setEditMode] = useState(false);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleUpdate = () => {
        setEditMode(false);
    };

    return (
        <div className="min-vh-100 bg-light">
            <Navbar />
            <Sidebar />
            <div 
                className="container-fluid"
                style={{
                paddingTop: '80px',
                paddingLeft: '290px',
                paddingRight: '20px',
                width: '100%',
                maxWidth: 'none'
                }}
            >
            <Navbar />
            <Sidebar />
            <Row>
                <Col>
                    <h1>Área de Servicio</h1>
                    {editMode ? (
                        <ServiceAreaSection providerId={id_provider} onUpdate={handleUpdate} />
                    ) : (
                        <ProviderServiceArea providerId={id_provider} onEdit={handleEdit} onUpdate={handleUpdate} />
                    )}
                </Col>
            </Row>
            </div>
        </div>
    );
};

export default ServiceAreaPage;
