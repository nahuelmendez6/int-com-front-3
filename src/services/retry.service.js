// Servicio para manejar reintentos automáticos de peticiones fallidas
export const retryRequest = async (requestFunction, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFunction();
    } catch (error) {
      lastError = error;
      
      // Solo reintentar en casos específicos
      const shouldRetry = 
        error.code === 'ECONNABORTED' || // Timeout
        error.code === 'NETWORK_ERROR' || // Error de red
        (error.response && error.response.status >= 500); // Errores del servidor
      
      if (!shouldRetry || attempt === maxRetries) {
        throw error;
      }
      
      console.warn(`Intento ${attempt} falló, reintentando en ${delay}ms...`, error.message);
      
      // Esperar antes del siguiente intento (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

// Función para crear peticiones con retry automático
export const createRetryableRequest = (requestFunction, options = {}) => {
  const { maxRetries = 3, delay = 1000 } = options;
  
  return () => retryRequest(requestFunction, maxRetries, delay);
};

export default retryRequest;
