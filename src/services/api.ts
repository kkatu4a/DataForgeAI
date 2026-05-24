import axios from 'axios';
import { authService } from './authService.ts';
import type { User, Dataset } from '../types/types';
import api from './api';

const API_BASE_URL = 'http://82.147.67.239:8080/api';

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



// fileAPI
export const fileAPI = {
    // загрузка изображений POST /api/v1/files/images/{id}
    uploadImages: async (datasetId: number, files: File[]): Promise<void> => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        await apiClient.post(`/v1/files/images/${datasetId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // загрузка файла разметки (метки) POST /api/v1/files/markup/{id}
    uploadMarkup: async (datasetId: number, file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);
        await apiClient.post(`/v1/files/markup/${datasetId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // загрузка файла вероятностей POST /api/v1/files/probability/{id}
    uploadProbability: async (datasetId: number, file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);
        await apiClient.post(`/v1/files/probability/${datasetId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // загрузка метаданных POST /api/v1/files/metadata/{id}
    uploadMetadata: async (datasetId: number, file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);
        await apiClient.post(`/v1/files/metadata/${datasetId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
};
export const datasetAPI = {
    create: async (data: {
        name: string;
        description?: string;
        visibility: 'PUBLIC' | 'PRIVATE';
        creatorId: number;
    }): Promise<Dataset> => {
        const requestData = {
            name: data.name,
            description: data.description || "",
            datasitoryType: data.visibility === 'PUBLIC' ? 'OPEN' : 'PRIVATE',
            creatorId: data.creatorId
        };
        const response = await apiClient.post('/v1/datasitory', requestData);
        return response.data;
    },

    delete: async (datasetId: number): Promise<void> => {
        await apiClient.delete(`/v1/datasitory/${datasetId}`);
    },
};

export default apiClient;