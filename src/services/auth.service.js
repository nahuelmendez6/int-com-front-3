import axios from 'axios';

const API_URL = "http://127.0.0.1:8000";

export const login = async (email, password) => {

    try {
        const response = await axios.post(`${API_URL}/auth/login/`, {
            email,
            password,
        });

        return response.data; // devoler role, user_id, etc

    } catch (error) {
        console.log(error);
        throw error.response?.data || { detail: "Login failed" };
    }

};

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}