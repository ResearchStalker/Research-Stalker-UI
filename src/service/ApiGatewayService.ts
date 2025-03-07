import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const getUser = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/user/me`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

export const getProfile = async (author_id: string, source: string) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/get_profile`,
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

export const getNetwork = async (author_id: string, source: string, recursivity: number = 0) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/get_network`,
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
