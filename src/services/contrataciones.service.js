import api from './api';

const contratacionesService = {
  /**
   * Obtiene la lista de trabajos aprobados (contrataciones) para el usuario actual.
   * El backend se encarga de devolver las contrataciones correspondientes
   * ya sea para un cliente o un proveedor, según el usuario autenticado.
   */
  getContrataciones: () => {
    // NOTA: La URL '/api/contrataciones/' es una propuesta.
    // Debe ser implementada en el backend según las instrucciones en backend_contrataciones.md
    return api.get('/api/contrataciones/');
  },
};

export default contratacionesService;
