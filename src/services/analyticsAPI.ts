import apiClient from './api';
import type { AnalyticsResponse, BrokenFile } from '../types/types';

export const analyticsAPI = {
    getAnalytics: async (datasetId: number): Promise<AnalyticsResponse> => {
        console.log('Запрос аналитики для датасета ID:', datasetId);
        console.log('URL:', `/v1/datasitory/analytics/${datasetId}`);
        
        // TODO: Раскомментировать, когда бэкенд будет готов
        /*
        try {
            const response = await apiClient.get(`/v1/datasitory/analytics/${datasetId}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при запросе аналитики:', error);
            throw error;
        }
        */
        
        // Временные моковые данные для отображения макета
        console.log('Используются моковые данные для макета');
        
        return {
            general: {
                readinessLevel: 75,
                totalObjects: 1248,
                totalClasses: 8,
            },
            classData: [
                { name: "person", value: 35, count: 437, deficit: 12 },
                { name: "car", value: 25, count: 312, deficit: 8 },
                { name: "dog", value: 15, count: 187, deficit: 5 },
                { name: "cat", value: 12, count: 150, deficit: 3 },
                { name: "bicycle", value: 8, count: 100, deficit: 2 },
                { name: "motorcycle", value: 3, count: 37, deficit: 1 },
                { name: "bus", value: 1, count: 12, deficit: 0 },
                { name: "truck", value: 1, count: 13, deficit: 0 },
            ],
            objects: [
                {
                    id: 1,
                    imageUrl: "https://picsum.photos/id/1/100/100",
                    tag: "person",
                    entropy: 0.23,
                    confidence: 0.95,
                    errorProbability: 0.03,
                    novelty: 0.78,
                    usefulness: 0.92,
                },
                {
                    id: 2,
                    imageUrl: "https://picsum.photos/id/2/100/100",
                    tag: "car",
                    entropy: 0.45,
                    confidence: 0.87,
                    errorProbability: 0.08,
                    novelty: 0.34,
                    usefulness: 0.65,
                },
                {
                    id: 3,
                    imageUrl: "https://picsum.photos/id/3/100/100",
                    tag: "dog",
                    entropy: 0.12,
                    confidence: 0.98,
                    errorProbability: 0.01,
                    novelty: 0.56,
                    usefulness: 0.88,
                },
                {
                    id: 4,
                    imageUrl: "https://picsum.photos/id/4/100/100",
                    tag: "cat",
                    entropy: 0.67,
                    confidence: 0.76,
                    errorProbability: 0.15,
                    novelty: 0.23,
                    usefulness: 0.45,
                },
                {
                    id: 5,
                    imageUrl: "https://picsum.photos/id/5/100/100",
                    tag: "bicycle",
                    entropy: 0.34,
                    confidence: 0.89,
                    errorProbability: 0.06,
                    novelty: 0.67,
                    usefulness: 0.71,
                },
            ],
            reliableData: [
                { id: 1, imageUrl: "https://picsum.photos/id/1/100/100", usefulness: 0.95, tag: "person" },
                { id: 2, imageUrl: "https://picsum.photos/id/2/100/100", usefulness: 0.92, tag: "car" },
                { id: 3, imageUrl: "https://picsum.photos/id/3/100/100", usefulness: 0.89, tag: "dog" },
                { id: 4, imageUrl: "https://picsum.photos/id/4/100/100", usefulness: 0.87, tag: "cat" },
                { id: 5, imageUrl: "https://picsum.photos/id/5/100/100", usefulness: 0.85, tag: "bicycle" },
            ],
            controversialObjects: [
                { id: 1, imageUrl: "https://picsum.photos/id/10/100/100", userLabel: "car", modelLabel: "truck" },
                { id: 2, imageUrl: "https://picsum.photos/id/11/100/100", userLabel: "dog", modelLabel: "wolf" },
                { id: 3, imageUrl: "https://picsum.photos/id/12/100/100", userLabel: "cat", modelLabel: "fox" },
                { id: 4, imageUrl: "https://picsum.photos/id/13/100/100", userLabel: "bicycle", modelLabel: "motorcycle" },
            ],
            duplicateGroups: [
                {
                    groupName: "Дубликаты группы A",
                    images: [
                        "https://picsum.photos/id/20/100/100",
                        "https://picsum.photos/id/21/100/100",
                        "https://picsum.photos/id/22/100/100",
                    ],
                },
                {
                    groupName: "Дубликаты группы B",
                    images: [
                        "https://picsum.photos/id/23/100/100",
                        "https://picsum.photos/id/24/100/100",
                    ],
                },
            ],
            poorQualityFiles: [
                { id: 1, imageUrl: "https://picsum.photos/id/30/100/100", reason: "Разрешение слишком низкое" },
                { id: 2, imageUrl: "https://picsum.photos/id/31/100/100", reason: "Файл повреждён" },
                { id: 3, imageUrl: "https://picsum.photos/id/32/100/100", reason: "Некорректный формат" },
            ],
            roadmap: {
                text: "1. Завершить разметку оставшихся 250 изображений\n2. Обучить модель на новых данных\n3. Провести валидацию модели на тестовой выборке\n4. Выгрузить готовый датасет в production",
            },
        };
    },
    
    checkBrokenFiles: async (files: File[]): Promise<BrokenFile[]> => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        const response = await apiClient.post('/files/check-broken', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
};