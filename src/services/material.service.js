// src/services/material.service.js
// =====================================================
// Servicio de Materiales (Material Service)
// -----------------------------------------------------
// Este servicio gestiona todos los endpoints relacionados con los
// materiales y sus archivos adjuntos (attachments) dentro del portafolio
// de un proveedor. Incluye operaciones CRUD y utilidades auxiliares.
// =====================================================

import api from './api';

const API_URL = '/portfolios';

const materialService = {
  // =====================================================
  // CRUD de Materiales
  // =====================================================

  /**
   * Obtener todos los materiales o filtrar por proveedor.
   * @param {number|string|null} [providerId=null] - ID del proveedor opcional.
   * @returns {Promise<Object[]>} Lista de materiales.
   */
  getMaterials: (providerId = null) => {
    const params = providerId ? `?id_provider=${providerId}` : '';
    return api.get(`${API_URL}/materials/${params}`);
  },

    /**
   * Alias semántico de getMaterials(), útil para mayor claridad.
   * @param {number|string} providerId - ID del proveedor.
   * @returns {Promise<Object[]>} Lista de materiales del proveedor.
   */
  getMaterialsByProvider: (providerId) => {
    // Esta función es básicamente un alias más explícito
    return materialService.getMaterials(providerId);
  },

    /**
   * Obtener un material específico por ID.
   * @param {number|string} id - ID del material.
   * @returns {Promise<Object>} Detalle del material.
   */
  getMaterialById: (id) => {
    return api.get(`${API_URL}/materials/${id}/`);
  },
  /**
   * Crear un nuevo material.
   * @param {Object} data - Datos del material (nombre, descripción, etc.).
   * @returns {Promise<Object>} Material creado.
   */
  createMaterial: (data) => {
    return api.post(`${API_URL}/materials/`, data);
  },
  /**
   * Actualizar parcialmente un material existente.
   * @param {number|string} id - ID del material.
   * @param {Object} data - Campos a actualizar.
   * @returns {Promise<Object>} Material actualizado.
   */
  updateMaterial: (id, data) => {
    return api.patch(`${API_URL}/materials/${id}/`, data);
  },
  /**
   * Marcar un material como eliminado (soft delete).
   * @param {number|string} id - ID del material.
   * @returns {Promise<Object>} Respuesta del servidor.
   */
  deleteMaterial: (id) => {
    return api.patch(`${API_URL}/materials/${id}/`, { is_deleted: true });
  },

  // =====================================================
  // CRUD de Archivos Adjuntos (Attachments)
  // =====================================================

  /**
   * Obtener los archivos adjuntos de un material.
   * @param {number|string|null} [materialId=null] - ID del material opcional.
   * @returns {Promise<Object[]>} Lista de archivos adjuntos.
   */
  getMaterialAttachments: (materialId = null) => {
    const params = materialId ? `?id_material=${materialId}` : '';
    return api.get(`${API_URL}/material-attachment/${params}`);
  },

    /**
   * Crear un nuevo archivo adjunto para un material.
   * @param {number|string} materialId - ID del material asociado.
   * @param {File} file - Archivo a subir.
   * @returns {Promise<Object>} Archivo adjunto creado.
   */
  createMaterialAttachment: (materialId, file) => {
    const formData = new FormData();
    formData.append('id_material', materialId);
    formData.append('file', file);
    
    return api.post(`${API_URL}/material-attachment/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  /**
   * Eliminar un archivo adjunto de un material.
   * @param {number|string} id - ID del archivo adjunto.
   * @returns {Promise<void>} Confirmación de eliminación.
   */
  deleteMaterialAttachment: (id) => {
    return api.delete(`${API_URL}/material-attachment/${id}/`);
  },
};

export default materialService;
