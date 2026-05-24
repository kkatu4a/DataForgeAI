import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileHeader from "../components/ProfileHeader";
import DatasetNavigation from "../components/DatasetNavigation";
import { authService } from "../services/authService";
import { datasetAPI } from "../services/api";
import type { Dataset } from "../types/types";
import ExportIcon from "../assets/icons/Export.svg";
import './DuplicatesPage.scss';

interface DuplicateObject {
  id: number;
  imageUrl: string;
  isMain: boolean;
  selected: boolean;
}

interface DuplicateGroup {
  groupName: string;
  objects: DuplicateObject[];
}

const DuplicatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const datasetId = Number(id);

  const [user, setUser] = useState<{ username: string } | null>(null);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [groups, setGroups] = useState<DuplicateGroup[]>([]);
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

    const fetchDuplicatesData = async () => {
      // TODO: заменить на реальный API
      setGroups([
        {
          groupName: "Дубликаты группы A",
          objects: [
            {
              id: 1,
              imageUrl: "https://picsum.photos/id/20/100/100",
              isMain: true,
              selected: false,
            },
            {
              id: 2,
              imageUrl: "https://picsum.photos/id/21/100/100",
              isMain: false,
              selected: false,
            },
            {
              id: 3,
              imageUrl: "https://picsum.photos/id/22/100/100",
              isMain: false,
              selected: false,
            },
          ],
        },
        {
          groupName: "Дубликаты группы B",
          objects: [
            {
              id: 4,
              imageUrl: "https://picsum.photos/id/23/100/100",
              isMain: true,
              selected: false,
            },
            {
              id: 5,
              imageUrl: "https://picsum.photos/id/24/100/100",
              isMain: false,
              selected: false,
            },
          ],
        },
      ]);
    };

    fetchUser();
    fetchDataset();
    fetchDuplicatesData();
  }, [navigate, datasetId]);

  const handleSelectAllInGroup = (groupIndex: number) => {
    setGroups(
      groups.map((group, idx) => {
        if (idx === groupIndex) {
          return {
            ...group,
            objects: group.objects.map((obj) => ({
              ...obj,
              selected: !obj.isMain,
            })),
          };
        }
        return group;
      }),
    );
  };

  const handleSelectObject = (groupIndex: number, objectId: number) => {
    setGroups(
      groups.map((group, idx) => {
        if (idx === groupIndex) {
          return {
            ...group,
            objects: group.objects.map((obj) =>
              obj.id === objectId && !obj.isMain
                ? { ...obj, selected: !obj.selected }
                : obj,
            ),
          };
        }
        return group;
      }),
    );
  };

  const handleDeleteSelected = async (groupIndex: number) => {
    const group = groups[groupIndex];
    const selectedIds = group.objects
      .filter((obj) => obj.selected)
      .map((obj) => obj.id);

    if (selectedIds.length === 0) {
      toast.error("Выберите объекты для удаления");
      return;
    }

    // TODO: отправить selectedIds на бэкенд
    setGroups(
      groups.map((group, idx) => {
        if (idx === groupIndex) {
          return {
            ...group,
            objects: group.objects.filter((obj) => !obj.selected),
          };
        }
        return group;
      }),
    );

    toast.success(`Удалено ${selectedIds.length} объектов`);
  };

  const hasSelectedInGroup = (group: DuplicateGroup): boolean => {
    return group.objects.some((obj) => obj.selected);
  };

  if (!dataset) {
    return <div className="loading">Загрузка...</div>;
  }

  const visibilityText = dataset.type === "OPEN" ? "Публичный" : "Приватный";

  return (
    <div className="duplicates-page">
      <ProfileHeader
        username={user?.username || "Пользователь"}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="duplicates-page__content">
        <div className="duplicates-page__header">
          <button
            className="duplicates-page__back-btn"
            onClick={() => navigate(`/profile/datasets/${datasetId}/analytics`)}
            type="button"
          >
            ← Назад
          </button>
          <div className="duplicates-page__title-wrapper">
            <h1 className="duplicates-page__title">{dataset.name}</h1>
            <span className="duplicates-page__visibility">
              {visibilityText}
            </span>
          </div>
          <div className="duplicates-page__actions">
            <button
              className="duplicates-page__action-btn"
              onClick={() =>
                navigate(`/profile/datasets/${datasetId}/analytics`)
              }
            >
              Аналитика
            </button>
            <button className="duplicates-page__action-btn duplicates-page__action-btn--active">
              Работа с датасетом
            </button>
            <button className="duplicates-page__export-btn">
              <img src={ExportIcon} alt="Export icon" />
            </button>
          </div>
        </div>

        <DatasetNavigation datasetId={datasetId} />

        <div className="duplicates-page__groups">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="duplicates-page__group">
              <div className="duplicates-page__group-header">
                <span className="duplicates-page__group-name">
                  {group.groupName}
                </span>
                <div className="duplicates-page__group-actions">
                  <button
                    className="duplicates-page__select-all-btn"
                    onClick={() => handleSelectAllInGroup(groupIndex)}
                  >
                    Выбрать все
                  </button>
                  {hasSelectedInGroup(group) && (
                    <button
                      className="duplicates-page__delete-btn"
                      onClick={() => handleDeleteSelected(groupIndex)}
                    >
                      Удалить выбранные
                    </button>
                  )}
                </div>
              </div>
              <div className="duplicates-page__group-content">
                <div className="duplicates-page__images">
                  {group.objects.map((obj) => (
                    <div
                      key={obj.id}
                      className={`duplicates-page__image-wrapper ${obj.isMain ? "duplicates-page__image-wrapper--main" : ""}`}
                    >
                      {!obj.isMain && (
                        <input
                          type="checkbox"
                          className="duplicates-page__image-checkbox"
                          checked={obj.selected}
                          onChange={() =>
                            handleSelectObject(groupIndex, obj.id)
                          }
                        />
                      )}
                      <img
                        src={obj.imageUrl}
                        alt={`duplicate-${obj.id}`}
                        className="duplicates-page__image"
                      />
                      {obj.isMain && (
                        <div className="duplicates-page__main-badge">
                          Главный
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DuplicatesPage;
