import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_PUBLIC_BASE_URL = process.env.REACT_APP_API_PUBLIC_URL || 'http://localhost:8080/public';

export const getUser = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/me`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const getProfile = async (logged: boolean, author_id: string, source: string) => {
    try {
        const api_url = logged ? `${API_BASE_URL}/get_network` : `${API_PUBLIC_BASE_URL}/get_network`
        const response = await axios.post(
            api_url,
            { author_id, source },
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const getNetwork = async (logged: boolean, author_id: string, source: string, recursivity: number = 0) => {
    try {
        const api_url = logged ? `${API_BASE_URL}/get_network` : `${API_PUBLIC_BASE_URL}/get_network`
        const response = await axios.post(
            api_url,
            { author_id, source, recursivity },
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching network:', error);
        throw error;
    }
};
