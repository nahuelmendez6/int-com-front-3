import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProviderServiceArea from '../components/provider-location/ProviderServiceArea.jsx';
import { useAuth } from '../hooks/useAuth.js';


/**
 * @function ServiceAreaPage
 * @description Componente principal de la página donde un proveedor define y gestiona
 * su área de servicio (las ciudades o zonas donde ofrece sus servicios).
 * * @returns {JSX.Element} La estructura de la página con el componente de gestión de áreas.
 */
const ServiceAreaPage = () => {

    // 1. Obtención de datos del proveedor autenticado
    // Se utiliza el hook useAuth para acceder a la información del perfil del usuario logueado.
    const { profile } = useAuth();

    // 2. Extracción del ID del proveedor
    // Se accede al id_provider anidado dentro del objeto profile para identificar
    // al proveedor actual. Esto es crucial para que el componente ProviderServiceArea
    // sepa qué áreas de servicio debe cargar o modificar.
    const id_provider = profile?.profile?.id_provider;


    return (
        // Contenedor principal de la página.
        <div className="service-area-page">

            {/* Tarjeta de presentación con sombra y bordes redondeados */}
            <div className="card shadow rounded-3">
                <div className="card-body p-4">

                    {/* Título de la página */}
                    <h1 className="card-title mb-4">
                        <i className="bi bi-geo-alt me-2"></i>
                        Área de Servicio
                    </h1>

                    {/* Descripción de la funcionalidad */}
                    <p className="text-muted mb-4">
                        Define las áreas geográficas donde ofreces tus servicios. Esto ayudará a los clientes a encontrar proveedores en su zona.
                    </p>

                    {/* 3. Componente de Gestión del Área de Servicio */}
                    {/* Este componente realiza toda la lógica de CRUD de las ciudades/zonas. */}
                    {/* Se le pasa el ID del proveedor (id_provider) como propiedad esencial. */}
                    <ProviderServiceArea providerId={id_provider} />
                </div>
            </div>
        </div>
    );
};

export default ServiceAreaPage;