// src/services/portfolio.service.js
// =====================================================
// Servicio de Portafolios (Portfolio Service)
// -----------------------------------------------------
// Este módulo gestiona todas las operaciones CRUD relacionadas con los
// portafolios y sus archivos adjuntos. Permite crear, leer, actualizar,
// eliminar (tanto hard como soft delete) y manejar archivos asociados
// a cada portafolio de un proveedor.
// =====================================================

import api from './api';

const portfolioService = {
  // =====================================================
  // CRUD de Portafolios
  // =====================================================

  /**
   * Obtener todos los portafolios disponibles.
   * Realiza una solicitud GET a `/portfolios/`.
   *
   * @async
   * @function getPortfolios
   * @returns {Promise<Object[]>} Lista de portafolios.
   *
   * @example
   * const portfolios = await portfolioService.getPortfolios();
   */
  getPortfolios: () => {
    return api.get('/portfolios/');
  },

  /**
   * Obtener un portafolio específico por su ID.
   * Realiza una solicitud GET a `/portfolios/{id}/`.
   *
   * @async
   * @function getPortfolioById
   * @param {number|string} id - ID del portafolio.
   * @returns {Promise<Object>} Detalles del portafolio.
   *
   * @example
   * const portfolio = await portfolioService.getPortfolioById(5);
   */
  getPortfolioById: (id) => {
    return api.get(`/portfolios/${id}/`);
  },

  /**
   * Obtener todos los portafolios pertenecientes a un proveedor específico.
   * Realiza una solicitud GET filtrando por `id_provider`.
   *
   * @async
   * @function getPortfoliosByProvider
   * @param {number|string} providerId - ID del proveedor.
   * @returns {Promise<Object[]>} Lista de portafolios del proveedor.
   *
   * @example
   * const providerPortfolios = await portfolioService.getPortfoliosByProvider(2);
   */
  getPortfoliosByProvider: (providerId) => {
    return api.get(`/portfolios/?id_provider=${providerId}`);
  },

  /**
   * Crear un nuevo portafolio.
   * Envía los datos mediante una solicitud POST a `/portfolios/`.
   *
   * @async
   * @function createPortfolio
   * @param {Object} data - Datos del portafolio (nombre, descripción, etc.).
   * @returns {Promise<Object>} Portafolio creado.
   *
   * @example
   * await portfolioService.createPortfolio({ name: 'Nuevo Portfolio', description: 'Ejemplo' });
   */
  createPortfolio: (data) => {
    return api.post('/portfolios/', data);
  },

  /**
   * Actualizar un portafolio existente.
   * Realiza una solicitud PUT a `/portfolios/{id}/`.
   *
   * @async
   * @function updatePortfolio
   * @param {number|string} id - ID del portafolio a actualizar.
   * @param {Object} data - Datos modificados del portafolio.
   * @returns {Promise<Object>} Portafolio actualizado.
   *
   * @example
   * await portfolioService.updatePortfolio(4, { name: 'Portfolio actualizado' });
   */
  updatePortfolio: (id, data) => {
    return api.put(`/portfolios/${id}/`, data);
  },

  /**
   * Eliminar un portafolio de forma permanente (hard delete).
   * Realiza una solicitud DELETE a `/portfolios/{id}/`.
   *
   * @async
   * @function deletePortfolio
   * @param {number|string} id - ID del portafolio.
   * @returns {Promise<Object>} Respuesta del servidor.
   *
   * @example
   * await portfolioService.deletePortfolio(7);
   */
  deletePortfolio: (id) => {
    return api.delete(`/portfolios/${id}/`);
  },

  /**
   * Eliminar un portafolio de forma lógica (soft delete).
   * Marca el registro como `is_deleted: true` mediante PATCH.
   *
   * @async
   * @function softDeletePortfolio
   * @param {number|string} id - ID del portafolio.
   * @returns {Promise<Object>} Portafolio marcado como eliminado.
   *
   * @example
   * await portfolioService.softDeletePortfolio(3);
   */
  softDeletePortfolio: (id) => {
    return api.patch(`/portfolios/${id}/`, { is_deleted: true });
  },

  // =====================================================
  // CRUD de Archivos Adjuntos (Attachments)
  // =====================================================

  /**
   * Crear un nuevo archivo adjunto asociado a un portafolio.
   * Envía el archivo en formato multipart/form-data al endpoint `/portfolios/attachments/`.
   *
   * @async
   * @function createAttachment
   * @param {number|string} portfolioId - ID del portafolio.
   * @param {File} file - Archivo a adjuntar.
   * @returns {Promise<Object>} Archivo adjunto creado.
   *
   * @example
   * const file = document.querySelector('#fileInput').files[0];
   * await portfolioService.createAttachment(2, file);
   */
  createAttachment: (portfolioId, file) => {
    const formData = new FormData();
    formData.append('id_portfolio', portfolioId);
    formData.append('file', file);
    
    return api.post('/portfolios/attachments/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Eliminar un archivo adjunto específico por su ID.
   * Realiza una solicitud DELETE a `/portfolios/attachments/{id}/`.
   *
   * @async
   * @function deleteAttachment
   * @param {number|string} id - ID del archivo adjunto.
   * @returns {Promise<Object>} Respuesta del servidor.
   *
   * @example
   * await portfolioService.deleteAttachment(15);
   */
  deleteAttachment: (id) => {
    return api.delete(`/portfolios/attachments/${id}/`);
  },
};

export default portfolioService;
