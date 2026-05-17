import axios, {type AxiosError} from 'axios';
import { authService } from './authService.ts';
import type { User, Dataset } from '../types/types';
import api from './api';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// добавление токена
apiClient.interceptors.request.use((config) => {
    const token = authService.getToken();

    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    else
        console.error("Нет токена авторизации")

    return config;
},
(error: AxiosError) => {
    console.error('Ошибка запроса:', error);
    return Promise.reject(error);
});

// обработка ошибок
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