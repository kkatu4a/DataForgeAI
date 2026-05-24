import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileHeader from "../components/ProfileHeader";
import GeneralAnalytics from "../components/GeneralAnalytics";
import ObjectsTable from "../components/ObjectsTable";
import ReliableDataTable from "../components/ReliableDataTable";
import ControversialObjectsTable from "../components/ControversialObjectsTable";
import DuplicatesGroups from "../components/DuplicatesGroups";
import PoorQualityFilesTable from "../components/PoorQualityFilesTable";
import RoadmapBlock from "../components/RoadmapBlock";
import { analyticsAPI } from "../services/analyticsAPI";
import { authService } from "../services/authService";
import { datasetAPI } from "../services/api";
import type { AnalyticsResponse, Dataset } from "../types/types";
import type { apiError } from "../types/apiError";

const DatasetAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const datasetId = Number(id);

  const [user, setUser] = useState<{ username: string } | null>(null);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await authService.fetchCurrentUser();
        if (userData && userData.id !== -1) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Ошибка загрузки пользователя", error);
      }
    };

    const fetchDataset = async () => {
      try {
        const data = await datasetAPI.getDatasetById(datasetId);
        setDataset(data);
      } catch (error) {
        console.error("Ошибка загрузки датасета", error);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const data = await analyticsAPI.getAnalytics(datasetId);
        setAnalytics(data);
      } catch (error) {
        const apiError = error as apiError;
        if (apiError.messages && apiError.messages.length > 0) {
          apiError.messages.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error("Ошибка загрузки аналитики");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
    fetchDataset();
    fetchAnalytics();
  }, [navigate, datasetId]);

  const handleBack = () => {
    navigate("/profile/datasets");
  };

  if (isLoading) {
    return <div className="loading">Загрузка аналитики...</div>;
  }

  if (!analytics || !dataset) {
    return <div className="error">Не удалось загрузить данные</div>;
  }

  const visibilityText = dataset.type === "OPEN" ? "Публичный" : "Приватный";

  return (
    <div className="dataset-analytics-page">
      <ProfileHeader
        username={user?.username || "Пользователь"}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="dataset-analytics-page__content">
        <div className="dataset-analytics-page__header">
          <button
            className="dataset-analytics-page__back-btn"
            onClick={handleBack}
            type="button"
          >
            ← Назад
          </button>
          <div className="dataset-analytics-page__title-wrapper">
            <h1 className="dataset-analytics-page__title">{dataset.name}</h1>
            <span className="dataset-analytics-page__visibility">
              {visibilityText}
            </span>
          </div>
          <div className="dataset-analytics-page__actions">
            <button className="dataset-analytics-page__action-btn dataset-analytics-page__action-btn--active">
              Аналитика
            </button>
            <button
              className="dataset-analytics-page__action-btn"
              onClick={() => navigate(`/profile/datasets/${datasetId}/edit`)}
            >
              Работа с датасетом
            </button>
            <button className="dataset-analytics-page__export-btn">
              Export
            </button>
          </div>
        </div>

        <section className="dataset-analytics-page__section">
          <h2 className="dataset-analytics-page__section-title">
            Общая аналитика
          </h2>
          <GeneralAnalytics
            general={analytics.general}
            classData={analytics.classData}
          />
        </section>

        <section className="dataset-analytics-page__section">
          <h2 className="dataset-analytics-page__section-title">Объекты</h2>
          <ObjectsTable data={analytics.objects} />
        </section>

        <section className="dataset-analytics-page__section">
          <h2 className="dataset-analytics-page__section-title">
            Надёжные данные
          </h2>
          <ReliableDataTable data={analytics.reliableData} />
        </section>

        <section className="dataset-analytics-page__section">
          <h2 className="dataset-analytics-page__section-title">
            Спорные объекты
          </h2>
          <ControversialObjectsTable data={analytics.controversialObjects} />
        </section>

        <section className="dataset-analytics-page__section">
          <h2 className="dataset-analytics-page__section-title">Дубликаты</h2>
          <DuplicatesGroups groups={analytics.duplicateGroups} />
        </section>

        <section className="dataset-analytics-page__section">
          <h2 className="dataset-analytics-page__section-title">
            Файлы плохого качества
          </h2>
          <PoorQualityFilesTable data={analytics.poorQualityFiles} />
        </section>

        <section className="dataset-analytics-page__section">
          <h2 className="dataset-analytics-page__section-title">
            Дорожная карта
          </h2>
          <RoadmapBlock text={analytics.roadmap.text} />
        </section>
      </div>
    </div>
  );
};

export default DatasetAnalyticsPage;
