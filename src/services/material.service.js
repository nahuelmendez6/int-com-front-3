import api from './api';

const materialService = {
  // CRUD for Materials
  getMaterials: (providerId = null) => {
    const params = providerId ? `?id_provider=${providerId}` : '';
    return api.get(`/portfolios/materials/${params}`);
  },
  getMaterialById: (id) => {
    return api.get(`/portfolios/materials/${id}/`);
  },
  createMaterial: (data) => {
    return api.post('/portfolios/materials/', data);
  },
  updateMaterial: (id, data) => {
    return api.patch(`/portfolios/materials/${id}/`, data);
  },
  deleteMaterial: (id) => {
    return api.patch(`/portfolios/materials/${id}/`, { is_deleted: true });
  },

  // CRUD for Material Attachments
  getMaterialAttachments: (materialId = null) => {
    const params = materialId ? `?id_material=${materialId}` : '';
    return api.get(`/portfolios/material-attachment/${params}`);
  },
  createMaterialAttachment: (materialId, file) => {
    const formData = new FormData();
    formData.append('id_material', materialId);
    formData.append('file', file);
    
    return api.post('/portfolios/material-attachment/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteMaterialAttachment: (id) => {
    return api.delete(`/portfolios/material-attachment/${id}/`);
  },
};

export default materialService;
