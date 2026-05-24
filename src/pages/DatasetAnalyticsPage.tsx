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
import type { AnalyticsResponse } from "../types/types";
import type { apiError } from "../types/apiError";

const DatasetAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const datasetId = Number(id);

  const [user, setUser] = useState<{ username: string } | null>(null);
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
    fetchAnalytics();
  }, [navigate, datasetId]);

  const handleBack = () => {
    navigate("/profile/datasets");
  };

  if (isLoading) {
    return <div className="loading">Загрузка аналитики...</div>;
  }

  if (!analytics) {
    return <div className="error">Не удалось загрузить аналитику</div>;
  }

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
          <h1 className="dataset-analytics-page__title">Аналитика датасета</h1>
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
