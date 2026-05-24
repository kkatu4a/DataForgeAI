import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileHeader from "../components/ProfileHeader";
import DatasetNavigation from "../components/DatasetNavigation";
import { authService } from "../services/authService";
import { datasetAPI } from "../services/api";
import type { Dataset } from "../types/types";

interface ControversialItem {
  id: number;
  imageUrl: string;
  userLabel: string;
  modelLabel: string;
  finalLabel: string;
}

const ControversialLabelsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const datasetId = Number(id);

  const [user, setUser] = useState<{ username: string } | null>(null);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [items, setItems] = useState<ControversialItem[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
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

    const fetchControversialData = async () => {
      // TODO: заменить на реальный API
      setItems([
        {
          id: 1,
          imageUrl: "https://picsum.photos/id/10/100/100",
          userLabel: "car",
          modelLabel: "truck",
          finalLabel: "car",
        },
        {
          id: 2,
          imageUrl: "https://picsum.photos/id/11/100/100",
          userLabel: "dog",
          modelLabel: "wolf",
          finalLabel: "dog",
        },
        {
          id: 3,
          imageUrl: "https://picsum.photos/id/12/100/100",
          userLabel: "cat",
          modelLabel: "fox",
          finalLabel: "cat",
        },
      ]);
      setAvailableClasses([
        "car",
        "truck",
        "dog",
        "wolf",
        "cat",
        "fox",
        "bird",
        "bicycle",
      ]);
    };

    fetchUser();
    fetchDataset();
    fetchControversialData();
  }, [navigate, datasetId]);

  const handleKeepAllLabels = () => {
    setItems(items.map((item) => ({ ...item, finalLabel: item.userLabel })));
    toast.success("Все метки заменены на метки пользователя");
  };

  const handleConfirmAllLabels = () => {
    setItems(items.map((item) => ({ ...item, finalLabel: item.modelLabel })));
    toast.success("Все метки заменены на метки модели");
  };

  const handleFinalLabelChange = (itemId: number, newLabel: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, finalLabel: newLabel } : item,
      ),
    );
  };

  const handleSaveAll = async () => {
    // TODO: отправить все finalLabel на бэкенд
    toast.success("Изменения сохранены");
  };

  if (!dataset) {
    return <div className="loading">Загрузка...</div>;
  }

  const visibilityText = dataset.type === "OPEN" ? "Публичный" : "Приватный";

  return (
    <div className="controversial-labels-page">
      <ProfileHeader
        username={user?.username || "Пользователь"}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="controversial-labels-page__content">
        <div className="controversial-labels-page__header">
          <button
            className="controversial-labels-page__back-btn"
            onClick={() => navigate(`/profile/datasets/${datasetId}/analytics`)}
            type="button"
          >
            ← Назад
          </button>
          <div className="controversial-labels-page__title-wrapper">
            <h1 className="controversial-labels-page__title">{dataset.name}</h1>
            <span className="controversial-labels-page__visibility">
              {visibilityText}
            </span>
          </div>
          <div className="controversial-labels-page__actions">
            <button
              className="controversial-labels-page__action-btn"
              onClick={() =>
                navigate(`/profile/datasets/${datasetId}/analytics`)
              }
            >
              Аналитика
            </button>
            <button className="controversial-labels-page__action-btn controversial-labels-page__action-btn--active">
              Работа с датасетом
            </button>
            <button className="controversial-labels-page__export-btn">
              Export
            </button>
          </div>
        </div>

        <DatasetNavigation datasetId={datasetId} />

        <div className="controversial-labels-page__controls">
          <button
            className="controversial-labels-page__radio-btn"
            onClick={handleKeepAllLabels}
          >
            Оставить все метки (пользовательские)
          </button>
          <button
            className="controversial-labels-page__radio-btn"
            onClick={handleConfirmAllLabels}
          >
            Подтвердить все метки (модельные)
          </button>
        </div>

        <div className="controversial-labels-page__table-wrapper">
          <table className="controversial-labels-page__table">
            <thead>
              <tr>
                <th>Объект</th>
                <th>Метка пользователя</th>
                <th>Предполагаемая метка модели</th>
                <th>Итоговая метка</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.imageUrl}
                      alt={`controversial-${item.id}`}
                      className="controversial-labels-page__thumbnail"
                    />
                  </td>
                  <td>{item.userLabel}</td>
                  <td>{item.modelLabel}</td>
                  <td>
                    <select
                      className="controversial-labels-page__select"
                      value={item.finalLabel}
                      onChange={(e) =>
                        handleFinalLabelChange(item.id, e.target.value)
                      }
                    >
                      {availableClasses.map((className) => (
                        <option key={className} value={className}>
                          {className}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="controversial-labels-page__save">
          <button
            className="controversial-labels-page__save-btn"
            onClick={handleSaveAll}
          >
            Сохранить все изменения
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControversialLabelsPage;
