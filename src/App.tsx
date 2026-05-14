import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import AuthPage from './pages/AuthPage';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/" element={<Navigate to="/register" />} />
            </Routes>
        </Router>
    );
}

export default App
