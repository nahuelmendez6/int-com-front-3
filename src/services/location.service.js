// src/services/location.service.js
// =====================================================
// Servicio de Ubicación (Location Service)
// -----------------------------------------------------
// Este módulo centraliza todas las operaciones relacionadas con la
// obtención y gestión de ubicaciones en la aplicación, incluyendo:
// - Provincias, departamentos y ciudades
// - Áreas de servicio de los proveedores
// - Sincronización y eliminación de ciudades del área de servicio
// =====================================================
import api from './api';

// =====================================================
// Obtener todas las provincias disponibles
// -----------------------------------------------------
// @returns {Promise<Object[]>} Lista de provincias
// =====================================================
export const getProvinces = async () => {
    try {
        const response = await api.get('locations/provinces/');
        return response.data;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
    }
};

// =====================================================
// Obtener departamentos por provincia
// -----------------------------------------------------
// @param {number|string} provinceId - ID de la provincia seleccionada
// @returns {Promise<Object[]>} Lista de departamentos pertenecientes a la provincia
// =====================================================
export const getDepartmentsByProvince = async (provinceId) => {
    try {
        const response = await api.get(`locations/departments/?province_id=${provinceId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching departments for province ${provinceId}:`, error);
        throw error;
    }
};

// =====================================================
// Obtener ciudades por departamento
// -----------------------------------------------------
// @param {number|string} departmentId - ID del departamento seleccionado
// @returns {Promise<Object[]>} Lista de ciudades del departamento
// =====================================================
export const getCitiesByDepartment = async (departmentId) => {
    try {
        const response = await api.get(`locations/cities/by-department/${departmentId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching cities for department ${departmentId}:`, error);
        throw error;
    }
};
// =====================================================
// Obtener el área de servicio actual de un proveedor
// -----------------------------------------------------
// @param {number|string} providerId - ID del proveedor
// @param {AbortSignal} [signal] - Opcional, permite cancelar la request
// @returns {Promise<Object[]>} Lista de ciudades en el área de servicio
// =====================================================
export const getProviderArea = async (providerId, signal) => {
    try {
        const response = await api.get(`locations/cities-area/${providerId}/`, { signal });
        return response.data;
    } catch (error) {
        if (error.name !== 'CanceledError') {
            console.error(`Error fetching service area for provider ${providerId}:`, error);
        }
        throw error;
    }
};
// =====================================================
// Actualizar ciudades del proveedor (sincronización)
// -----------------------------------------------------
// @param {string} token - Token de autenticación del proveedor
// @param {Object} data - Datos con IDs de ciudades a asociar al proveedor
// @returns {Promise<Object>} Respuesta del servidor
// =====================================================
export const updateProviderCities = async (token, data) => {
    try {
        const response = await api.patch(
            `/locations/provider-cities/sync/`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('se imprime?');
        return response.data;
    } catch (error) {
        console.error('Error updating provider cities:', error.response?.data || error);
        throw error;
    }
};

// =====================================================
// Eliminar ciudad del área de servicio de un proveedor
// -----------------------------------------------------
// @param {string} token - Token de autenticación del proveedor
// @param {number|string} providerId - ID del proveedor
// @param {number|string} cityId - ID de la ciudad a eliminar
// @returns {Promise<void>} Confirmación de eliminación
// =====================================================
export const removeCityFromProviderArea = async (token, providerId, cityId) => {
    try {

        const response = await api.delete(`locations/providers/${providerId}/cities/${cityId}/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error removing city ${cityId} from provider ${providerId}:`, error.response?.data || error);
        throw error;
    }
};