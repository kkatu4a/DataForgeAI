import React from "react";
import type { Dataset } from "../types/types";
import DatasetCard from "./DatasetCard";
import './MyDatasetsList.scss';

interface MyDatasetsListProps {
  datasets: Dataset[];
  searchQuery: string;
}

const MyDatasetsList: React.FC<MyDatasetsListProps> = ({
  datasets,
  searchQuery,
}) => {
  const handleCreateDataset = () => {
    // TODO: добавить функционал создания датасета позже
    console.log("Создать датасет");
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
          <DatasetCard key={dataset.id} dataset={dataset} showCreator={true} />
        ))}
      </div>
    </div>
  );
};

export default MyDatasetsList;
