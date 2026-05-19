import axios from 'axios';
import { authService } from './authService.ts';
import type { User, Dataset } from '../types/types';
import api from './api';

const API_BASE_URL = 'https://f52olv-213-208-175-202.ru.tuna.am/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'tuna-skip-browser-warning': 'true',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = authService.getToken();
    
    const publicEndpoints = ['/v1/user/registration', '/v1/user/authentication'];
    const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else if (!isPublic) {
        console.error("Нет токена авторизации для", config.url);
    }
    
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401 || error.response.status === 403) {
            window.location.href = '/auth';
        }
        return Promise.reject({
            code: error.response.data.code,
            messages: error.response.data.messages
        });
    }
);

export const userAPI = {
    getMe: async (): Promise<User> => {
        const response = await api.get('/v1/user/me');
        return response.data;
    },
    
    getMyDatasets: async (): Promise<Dataset[]> => {
        const response = await api.get('/v1/datasitory/my');
        return response.data;
    },
};

export default apiClient;