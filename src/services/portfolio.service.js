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

  // CRUD for Attachments
  createAttachment: (portfolioId, file) => {
    const formData = new FormData();
    formData.append('id_portfolio', portfolioId);
    formData.append('file', file);
    
    return api.post('/portfolio-attachments/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteAttachment: (id) => {
    return api.delete(`/portfolio-attachments/${id}/`);
  },
};

export default portfolioService;
