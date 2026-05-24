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

export interface GeneralAnalytics {
    readinessLevel: number;
    totalObjects: number;
    totalClasses: number;
}

export interface ClassData {
    name: string;
    value: number;
    count: number;
    deficit: number;
}

export interface AnalyticsObject {
    id: number;
    imageUrl: string;
    tag: string;
    entropy: number;
    confidence: number;
    errorProbability: number;
    novelty: number;
    usefulness: number;
}

export interface ReliableData {
    id: number;
    imageUrl: string;
    usefulness: number;
    tag: string;
}

export interface ControversialObject {
    id: number;
    imageUrl: string;
    userLabel: string;
    modelLabel: string;
}

export interface DuplicateGroup {
    groupName: string;
    images: string[];
}

export interface PoorQualityFile {
    id: number;
    imageUrl: string;
    reason: string;
}

export interface Roadmap {
    text: string;
}

export interface AnalyticsResponse {
    general: GeneralAnalytics;
    classData: ClassData[];
    objects: AnalyticsObject[];
    reliableData: ReliableData[];
    controversialObjects: ControversialObject[];
    duplicateGroups: DuplicateGroup[];
    poorQualityFiles: PoorQualityFile[];
    roadmap: Roadmap;
}

export interface BrokenFile {
    name: string;
    reason: string;
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