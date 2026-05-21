import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userAPI } from "../services/api";
import { authService } from "../services/authService";
import ProfileHeader from "../components/ProfileHeader";
import StarredDatasetsList from "../components/StarredDatasetsList";
import type { User, Dataset } from "../types/types";
import type { apiError } from "../types/apiError";
import './StarsPage.scss';

const StarsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [starredDatasets, setStarredDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = await userAPI.getMe();
        setUser(userData);
        // TODO: когда появится API для избранных датасетов
        setStarredDatasets([]);
      } catch (error) {
        const apiError = error as apiError;
        if (apiError.messages) {
          apiError.messages.forEach((msg) => toast.error(msg));
        } else {
          toast.error("Ошибка загрузки");
        }
        if (apiError.code === 401) {
          authService.logout();
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const filteredStarred = starredDatasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleUnstar = (datasetId: number) => {
    // TODO: API запрос на удаление из избранного
    setStarredDatasets((prev) => prev.filter((d) => d.id !== datasetId));
    toast.success("Датасет удалён из избранного");
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!user) {
    return <div className="error">Не удалось загрузить данные</div>;
  }

  return (
    <div className="stars-page">
      <ProfileHeader
        username={user.username}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="stars-page__content">
        <StarredDatasetsList
          datasets={filteredStarred}
          onUnstar={handleUnstar}
        />
      </div>
    </div>
  );
};

export default StarsPage;
