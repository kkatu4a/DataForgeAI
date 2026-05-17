import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userAPI } from "../services/api";
import { authService } from "../services/authService";
import ProfileHeader from "../components/ProfileHeader";
import MyDatasetsList from "../components/MyDatasetsList";
import type { User, Dataset } from "../types/types";
import type { apiError } from "../types/apiError";

const MyDatasetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
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
        const [userData, datasetsData] = await Promise.all([
          userAPI.getMe(),
          userAPI.getMyDatasets(),
        ]);
        setUser(userData);
        setDatasets(datasetsData);
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

  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!user) {
    return <div className="error">Не удалось загрузить данные</div>;
  }

  return (
    <div className="my-datasets-page">
      <ProfileHeader
        username={user.username}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="my-datasets-page__content">
        <MyDatasetsList datasets={filteredDatasets} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default MyDatasetsPage;
