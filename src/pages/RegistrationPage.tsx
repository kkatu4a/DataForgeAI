import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registrationService } from '../services/registrationService';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import type { apiError } from '../types/apiError';

const RegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await registrationService.registration({ username, email, password });
            
            toast.success('Регистрация успешна!');
            await authService.login({ email, password });
            login();
            
            navigate('/profile');
        } catch (error) {
            const apiError = error as apiError;
            
            if (apiError.messages && apiError.messages.length > 0) {
                apiError.messages.forEach((msg: string) => toast.error(msg));
            } else {
                toast.error(`Ошибка ${apiError.code || 'регистрации'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Регистрация</h2>
            
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                
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
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
            </form>
            
            <p>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </div>
    );
};

export default RegistrationPage;