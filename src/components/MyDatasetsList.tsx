import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { Dataset } from "../types/types";
import DatasetCard from "./DatasetCard";
import { datasetAPI } from "../services/api";
import type { apiError } from "../types/apiError";

interface MyDatasetsListProps {
  datasets: Dataset[];
  searchQuery: string;
  onDatasetDelete?: (datasetId: number) => void;
}

const MyDatasetsList: React.FC<MyDatasetsListProps> = ({
  datasets,
  searchQuery,
  onDatasetDelete,
}) => {
  const navigate = useNavigate();

  const handleCreateDataset = () => {
    navigate("/profile/datasets/create");
  };

  const handleDeleteDataset = async (datasetId: number) => {
    if (
      window.confirm(
        "Вы уверены, что хотите удалить этот датасет? Это действие необратимо.",
      )
    ) {
      try {
        await datasetAPI.delete(datasetId);
        toast.success("Датасет успешно удалён");
        if (onDatasetDelete) {
          onDatasetDelete(datasetId);
        }
      } catch (error) {
        const apiError = error as apiError;
        if (apiError.messages && apiError.messages.length > 0) {
          apiError.messages.forEach((msg: string) => toast.error(msg));
        } else {
          toast.error("Ошибка удаления датасета");
        }
      }
    }
  };

  if (datasets.length === 0) {
    return (
      <div className="my-datasets">
        <div className="my-datasets__header">
          <h3 className="my-datasets__title">Мои датасеты</h3>
          <button
            className="my-datasets__create-btn"
            onClick={handleCreateDataset}
          >
            Создать датасет
          </button>
        </div>
        {searchQuery ? (
          <p className="my-datasets__empty">
            Ничего не найдено по запросу "{searchQuery}"
          </p>
        ) : (
          <p className="my-datasets__empty">У вас пока нет датасетов</p>
        )}
      </div>
    );
  }

  return (
    <div className="my-datasets">
      <div className="my-datasets__header">
        <h3 className="my-datasets__title">Мои датасеты ({datasets.length})</h3>
        <button
          className="my-datasets__create-btn"
          onClick={handleCreateDataset}
        >
          Создать датасет
        </button>
      </div>
      <div className="my-datasets__list">
        {datasets.map((dataset) => (
          <DatasetCard
            key={dataset.id}
            dataset={dataset}
            showCreator={true}
            onDeleteClick={() => handleDeleteDataset(dataset.id)}
            showAnalyticsButton={true}
          />
        ))}
      </div>
    </div>
  );
};

export default MyDatasetsList;
