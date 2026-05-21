import React from "react";
import type { Dataset } from "../types/types";
import './DatasetCard.scss';

interface DatasetCardProps {
  dataset: Dataset;
  showCreator?: boolean;
  onStarClick?: () => void;
  isStarred?: boolean;
}

const DatasetCard: React.FC<DatasetCardProps> = ({
  dataset,
  showCreator = true,
  onStarClick,
  isStarred,
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="dataset-card">
      <div className="dataset-card__name">{dataset.name}</div>
      <div className="dataset-card__description">{dataset.description}</div>
      <div className="dataset-card__meta">
        <span className="dataset-card__type">{dataset.type}</span>
        <span className="dataset-card__date">
          {formatDate(dataset.createdAt)}
        </span>
        <span className="dataset-card__date">
          {formatDate(dataset.updatedAt)}
        </span>
      </div>
      {showCreator && (
        <div className="dataset-card__creator">
          {dataset.creator.username}
        </div>
      )}
      {onStarClick && (
        <button
          className={`dataset-card__star-btn ${isStarred ? "dataset-card__star-btn--active" : ""}`}
          onClick={onStarClick}
        >
          {isStarred ? "★ Удалить из звёзд" : "☆ В избранное"}
        </button>
      )}
    </div>
  );
};

export default DatasetCard;
