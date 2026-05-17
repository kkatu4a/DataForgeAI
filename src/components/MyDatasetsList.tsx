import React from "react";
import type { Dataset } from "../types/types";
import DatasetCard from "./DatasetCard";

interface MyDatasetsListProps {
  datasets: Dataset[];
  searchQuery: string;
}

const MyDatasetsList: React.FC<MyDatasetsListProps> = ({
  datasets,
  searchQuery,
}) => {
  if (datasets.length === 0) {
    return (
      <div className="my-datasets">
        <h3 className="my-datasets__title">Мои датасеты</h3>
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
      <h3 className="my-datasets__title">Мои датасеты ({datasets.length})</h3>
      <div className="my-datasets__list">
        {datasets.map((dataset) => (
          <DatasetCard key={dataset.id} dataset={dataset} showCreator={true} />
        ))}
      </div>
    </div>
  );
};

export default MyDatasetsList;
