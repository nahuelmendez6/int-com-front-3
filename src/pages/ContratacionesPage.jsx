import React, { useState, useEffect } from 'react';
// Importa el servicio para interactuar con la API de contrataciones
import contratacionesService from '../services/contrataciones.service.js';
// Importa el componente para mostrar la lista de contrataciones
import ContratacionList from '../components/contrataciones/ContratacionList.jsx';
// Importa el componente para mostrar estadísticas de postulaciones (solo para 'provider')
import PostulationStatistics from '../components/postulations/PostulationStatistics.jsx';
// Importa componentes de react-bootstrap para la interfaz (Alerta, Pestañas, Pestaña)
import { Alert, Tabs, Tab } from 'react-bootstrap';
// Importa el hook de autenticación para acceder al perfil del usuario
import { useAuth } from '../hooks/useAuth.js';

// Define el componente de la página principal de Contrataciones
const ContratacionesPage = () => {
  // Obtiene el perfil del usuario autenticado para verificar el rol
  const { profile } = useAuth();
  // Estado para almacenar la lista de contrataciones
  const [contrataciones, setContrataciones] = useState([]);
  // Estado para indicar si los datos se están cargando
  const [loading, setLoading] = useState(true);
  // Estado para almacenar mensajes de error
  const [error, setError] = useState(null);
  // Estado para controlar la pestaña activa (útil solo para el rol 'provider')
  const [activeTab, setActiveTab] = useState('contrataciones');

  // Hook useEffect para realizar la carga inicial de datos al montar el componente
  useEffect(() => {
    // Función asíncrona para obtener los datos de las contrataciones
    const fetchData = async () => {
      try {
        setLoading(true); // Inicia la carga
        // Llama al servicio para obtener la lista de contrataciones
        const response = await contratacionesService.getContrataciones();
        // Almacena los datos de la respuesta en el estado
        setContrataciones(response.data);
      } catch (error) {
        // Captura y registra cualquier error durante la carga
        console.error("Error al cargar las contrataciones", error);
        // Establece un mensaje de error amigable, sugiriendo una posible causa
        setError('No se pudieron cargar las contrataciones. Es posible que la funcionalidad del backend aún no esté implementada. Consulta el archivo backend_contrataciones.md.');
      } finally {
        // Se ejecuta siempre, finalizando el estado de carga
        setLoading(false);
      }
    };
    // Ejecuta la función de carga de datos
    fetchData();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Muestra un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="contrataciones-page">
        <div className="card shadow rounded-3">
          <div className="card-body p-4">
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando contrataciones...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verifica si el usuario tiene el rol de 'provider'
  const isProvider = profile?.role === 'provider';

  // Renderizado principal del componente
  return (
    <div className="contrataciones-page">
      <div className="card shadow rounded-3">
        <div className="card-body p-4">
          {/* Título de la página, dinámico según el rol */}
          <h1 className="card-title mb-4">
            <i className="bi bi-check2-square me-2"></i>
            {isProvider ? 'Trabajos Aprobados' : 'Mis Contrataciones'}
          </h1>
          {/* Descripción de la página, dinámica según el rol */}
          <p className="text-muted mb-4">
            {isProvider 
              ? 'Gestiona tus trabajos aprobados y visualiza estadísticas de tus postulaciones.'
              : 'Gestiona tus contrataciones activas y el historial de servicios contratados.'}
          </p>
          
          {/* Muestra una alerta si hay un error */}
          {error && (
            <Alert variant="danger" className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}

          {/* Renderizado condicional basado en el rol del usuario */}
          {isProvider ? (
            // Si es 'provider', muestra pestañas para contrataciones y estadísticas
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)} // Actualiza la pestaña activa al seleccionarla
              className="mb-4"
            >
              {/* Pestaña de Trabajos Aprobados (Contrataciones) */}
              <Tab eventKey="contrataciones" title={
                <span>
                  <i className="bi bi-check2-square me-2"></i>
                  Trabajos Aprobados
                </span>
              }>
                {/* Muestra la lista de contrataciones si no hay error */}
                {!error && <ContratacionList contrataciones={contrataciones} />}
              </Tab>
              {/* Pestaña de Estadísticas de Postulaciones */}
              <Tab eventKey="estadisticas" title={
                <span>
                  <i className="bi bi-bar-chart-fill me-2"></i>
                  Estadísticas
                </span>
              }>
                {/* Muestra el componente de estadísticas */}
                <div className="mt-4">
                  <PostulationStatistics />
                </div>
              </Tab>
            </Tabs>
          ) : (
            // Si NO es 'provider' (es cliente o rol por defecto), solo muestra la lista de contrataciones
            !error && <ContratacionList contrataciones={contrataciones} />
          )}
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para poder ser utilizado en otras partes de la aplicación
export default ContratacionesPage;