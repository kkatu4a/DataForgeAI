import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import type { apiError } from '../types/apiError';

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await authService.login({ email, password });
            toast.success('Вход выполнен успешно!');
            login();
            navigate('/profile');
        } catch (error) {
            const apiError = error as apiError;
            
            if (apiError.messages && apiError.messages.length > 0) {
                apiError.messages.forEach((msg: string) => toast.error(msg));
            } else {
                toast.error('Ошибка входа');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Вход</h2>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                
                <div>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>
            </form>
            
            <p>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
};

export default AuthPage;