export interface User{
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