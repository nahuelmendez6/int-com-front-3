import api from './api';

export const getProvinces = async () => {
    try {
        const response = await api.get('locations/provinces/');
        return response.data;
    } catch (error) {
        console.error('Error fetching provinces:', error);
        throw error;
    }
};

export const getDepartmentsByProvince = async (provinceId) => {
    try {
        const response = await api.get(`locations/departments/?province_id=${provinceId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching departments for province ${provinceId}:`, error);
        throw error;
    }
};

export const getCitiesByDepartment = async (departmentId) => {
    try {
        const response = await api.get(`locations/cities/by-department/${departmentId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching cities for department ${departmentId}:`, error);
        throw error;
    }
};
