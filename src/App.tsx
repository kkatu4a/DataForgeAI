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
import CreateDatasetPage from "./pages/CreateDatasetPage";
import DatasetAnalyticsPage from "./pages/DatasetAnalyticsPage";
import { useAuthStore } from "./store/authStore";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<AuthPage />} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/datasets"
          element={
            <PrivateRoute>
              <MyDatasetsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/datasets/create"
          element={
            <PrivateRoute>
              <CreateDatasetPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/datasets/:id/analytics"
          element={
            <PrivateRoute>
              <DatasetAnalyticsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile/stars"
          element={
            <PrivateRoute>
              <StarsPage />
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/profile" />} />
      </Routes>
    </Router>
  );
}

export default App;
