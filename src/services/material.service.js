import api from './api';

const API_URL = '/portfolios';

const materialService = {
  // -------------------------------
  // CRUD for Materials
  // -------------------------------
  getMaterials: (providerId = null) => {
    const params = providerId ? `?id_provider=${providerId}` : '';
    return api.get(`${API_URL}/materials/${params}`);
  },

  getMaterialsByProvider: (providerId) => {
    // Esta función es básicamente un alias más explícito
    return materialService.getMaterials(providerId);
  },

  getMaterialById: (id) => {
    return api.get(`${API_URL}/materials/${id}/`);
  },

  createMaterial: (data) => {
    return api.post(`${API_URL}/materials/`, data);
  },

  updateMaterial: (id, data) => {
    return api.patch(`${API_URL}/materials/${id}/`, data);
  },

  deleteMaterial: (id) => {
    return api.patch(`${API_URL}/materials/${id}/`, { is_deleted: true });
  },

  // -------------------------------
  // CRUD for Material Attachments
  // -------------------------------
  getMaterialAttachments: (materialId = null) => {
    const params = materialId ? `?id_material=${materialId}` : '';
    return api.get(`${API_URL}/material-attachment/${params}`);
  },

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

  deleteMaterialAttachment: (id) => {
    return api.delete(`${API_URL}/material-attachment/${id}/`);
  },
};

export default materialService;
