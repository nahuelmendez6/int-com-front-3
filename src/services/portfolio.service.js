import api from './api';

const portfolioService = {
  // CRUD for Portfolios
  getPortfolios: () => {
    return api.get('/portfolios/');
  },
  getPortfolioById: (id) => {
    return api.get(`/portfolios/${id}/`);
  },
  createPortfolio: (data) => {
    return api.post('/portfolios/', data);
  },
  updatePortfolio: (id, data) => {
    return api.put(`/portfolios/${id}/`, data);
  },
  deletePortfolio: (id) => {
    return api.delete(`/portfolios/${id}/`);
  },
  softDeletePortfolio: (id) => {
    return api.patch(`/portfolios/${id}/`, { is_deleted: true });
  },

  // CRUD for Attachments
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
  deleteAttachment: (id) => {
    return api.delete(`/portfolios/attachments/${id}/`);
  },
};

export default portfolioService;
