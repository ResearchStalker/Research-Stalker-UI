import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const login = () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
};

export const logout = async () => {
    try {
        await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
        window.location.reload();
    } catch (error) {
        console.error('Error during logout:', error);
    }
};
