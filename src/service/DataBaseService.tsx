import axios from 'axios';

const API_BASE_URL = 'http://localhost:5421';

export const getProfile = async (author_id: string, source: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/get_profile`, {
            author_id,
            source,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const getNetwork = async (author_id: string, source: string, recursivity: number = 0) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/get_network`, {
            author_id,
            source,
            recursivity,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching network:', error);
        throw error;
    }
};