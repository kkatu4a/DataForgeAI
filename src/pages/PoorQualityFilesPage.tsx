import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileHeader from "../components/ProfileHeader";
import DatasetNavigation from "../components/DatasetNavigation";
import { authService } from "../services/authService";
import { datasetAPI } from "../services/api";
import type { Dataset } from "../types/types";

interface PoorQualityItem {
  id: number;
  imageUrl: string;
  label: string;
  reason: string;
  selected: boolean;
}

const PoorQualityFilesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const datasetId = Number(id);

  const [user, setUser] = useState<{ username: string } | null>(null);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [items, setItems] = useState<PoorQualityItem[]>([]);
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

    const fetchPoorQualityData = async () => {
      // TODO: заменить на реальный API
      setItems([
        {
          id: 1,
          imageUrl: "https://picsum.photos/id/30/100/100",
          label: "car",
          reason: "Разрешение слишком низкое",
          selected: false,
        },
        {
          id: 2,
          imageUrl: "https://picsum.photos/id/31/100/100",
          label: "dog",
          reason: "Файл повреждён",
          selected: false,
        },
        {
          id: 3,
          imageUrl: "https://picsum.photos/id/32/100/100",
          label: "cat",
          reason: "Некорректный формат",
          selected: false,
        },
        {
          id: 4,
          imageUrl: "https://picsum.photos/id/33/100/100",
          label: "person",
          reason: "Размытое изображение",
          selected: false,
        },
      ]);
    };

    fetchUser();
    fetchDataset();
    fetchPoorQualityData();
  }, [navigate, datasetId]);

  const hasSelectedItems = items.some((item) => item.selected);

  const handleSelectAll = () => {
    setItems(items.map((item) => ({ ...item, selected: true })));
  };

  const handleDeselectAll = () => {
    setItems(items.map((item) => ({ ...item, selected: false })));
  };

  const handleSelectItem = (itemId: number) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const handleDeleteSelected = async () => {
    const selectedIds = items
      .filter((item) => item.selected)
      .map((item) => item.id);

    if (selectedIds.length === 0) {
      toast.error("Выберите объекты для удаления");
      return;
    }

    // TODO: отправить selectedIds на бэкенд
    setItems(items.filter((item) => !item.selected));
    toast.success(`Удалено ${selectedIds.length} объектов`);
  };

  const handleDeleteAll = async () => {
    // TODO: отправить запрос на удаление всех файлов плохого качества
    setItems([]);
    toast.success("Все файлы плохого качества удалены");
  };

  if (!dataset) {
    return <div className="loading">Загрузка...</div>;
  }

  const visibilityText = dataset.type === "OPEN" ? "Публичный" : "Приватный";

  return (
    <div className="poor-quality-files-page">
      <ProfileHeader
        username={user?.username || "Пользователь"}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="poor-quality-files-page__content">
        <div className="poor-quality-files-page__header">
          <button
            className="poor-quality-files-page__back-btn"
            onClick={() => navigate(`/profile/datasets/${datasetId}/analytics`)}
            type="button"
          >
            ← Назад
          </button>
          <div className="poor-quality-files-page__title-wrapper">
            <h1 className="poor-quality-files-page__title">{dataset.name}</h1>
            <span className="poor-quality-files-page__visibility">
              {visibilityText}
            </span>
          </div>
          <div className="poor-quality-files-page__actions">
            <button
              className="poor-quality-files-page__action-btn"
              onClick={() =>
                navigate(`/profile/datasets/${datasetId}/analytics`)
              }
            >
              Аналитика
            </button>
            <button className="poor-quality-files-page__action-btn poor-quality-files-page__action-btn--active">
              Работа с датасетом
            </button>
            <button className="poor-quality-files-page__export-btn">
              Export
            </button>
          </div>
        </div>

        <DatasetNavigation datasetId={datasetId} />

        <div className="poor-quality-files-page__controls">
          <button
            className="poor-quality-files-page__delete-all-btn"
            onClick={handleDeleteAll}
          >
            Удалить всё
          </button>
          {hasSelectedItems && (
            <button
              className="poor-quality-files-page__delete-selected-btn"
              onClick={handleDeleteSelected}
            >
              Удалить выбранные
            </button>
          )}
        </div>

        <div className="poor-quality-files-page__table-wrapper">
          <table className="poor-quality-files-page__table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      e.target.checked ? handleSelectAll() : handleDeselectAll()
                    }
                  />
                </th>
                <th>Объект</th>
                <th>Метка</th>
                <th>Причина попадания</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </td>
                  <td>
                    <img
                      src={item.imageUrl}
                      alt={`poor-quality-${item.id}`}
                      className="poor-quality-files-page__thumbnail"
                    />
                  </td>
                  <td>{item.label}</td>
                  <td>{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PoorQualityFilesPage;
