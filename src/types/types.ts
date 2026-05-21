export interface User {
    id: number;
    username: string;
    email: string;
    createdAt: string;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface AuthenticationResponse {
    token: string;
}

export interface Creator {
    id: number;
    email: string;
    username: string;
    createdAt: string;
}

export interface Dataset {
    id: number;
    name: string;
    description: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    creator: Creator;
}

export interface CreateDatasetRequest {
    name: string;
    description?: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    imageUrls: string[];
    labelsFile: File;
    probabilitiesFile?: File;
    metadataFile?: File;
}

// ответ от File Management API
export interface FileInfoResponse {
    id: number;
    name: string;
    originalName: string;
    contentType: string;
    size: number;
    fileType: 'IMAGE' | 'PROBABILITY' | 'METADATA' | 'MARKUP';
    createdAt: string;
}

// можно оставить на будущее или удалить

// export interface UploadImagesParams {
//     id: number;
//     files: File[];
// }

// export interface UploadFileParams {
//     id: number;
//     file: File;
// }