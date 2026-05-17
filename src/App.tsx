import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import MyDatasetsPage from "./pages/MyDatasetsPage";
import StarsPage from "./pages/StarsPage";
// import { useAuthStore } from "./store/authStore";

// Компонент для защиты приватных маршрутов
// const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated } = useAuthStore();
//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<AuthPage />} />

        {/* Приватные маршруты (требуют авторизации) */}
        <Route
          path="/profile"
          element={
            // <PrivateRoute>
              <ProfilePage />
            // </PrivateRoute>
          }
        />

        <Route
          path="/profile/datasets"
          element={
            // <PrivateRoute>
              <MyDatasetsPage />
            // </PrivateRoute>
          }
        />

        <Route
          path="/profile/stars"
          element={
            // <PrivateRoute>
              <StarsPage />
            //</PrivateRoute>
          }
        />

        {/* Перенаправление */}
        <Route path="/" element={<Navigate to="/profile" />} />
      </Routes>
    </Router>
  );
}

export default App;
