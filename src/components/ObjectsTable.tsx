import React, { useState, useMemo } from "react";
import type { AnalyticsObject } from "../types/types";

interface ObjectsTableProps {
  data: AnalyticsObject[];
}

const ObjectsTable: React.FC<ObjectsTableProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof AnalyticsObject | null>(
    null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof AnalyticsObject) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      item.tag?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      const aString = String(aVal);
      const bString = String(bVal);
      return sortDirection === "asc"
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [filteredData, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="objects-table">
      <div className="objects-table__toolbar">
        <div className="objects-table__search-icon"></div>
        <input
          type="text"
          className="objects-table__search"
          placeholder="Поиск по тегу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="objects-table__scroll-wrapper">
        <table className="objects-table__table">
          <thead>
            <tr>
              <th onClick={() => handleSort("imageUrl")}>
                Объект
                {sortField === "imageUrl" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th onClick={() => handleSort("tag")}>
                Тег
                {sortField === "tag" && (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th onClick={() => handleSort("entropy")}>
                Энтропия
                {sortField === "entropy" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th onClick={() => handleSort("confidence")}>
                Уверенность модели
                {sortField === "confidence" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th onClick={() => handleSort("errorProbability")}>
                Вероятность ошибки разметки
                {sortField === "errorProbability" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th onClick={() => handleSort("novelty")}>
                Новизна
                {sortField === "novelty" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th onClick={() => handleSort("usefulness")}>
                Полезность для дообучения
                {sortField === "usefulness" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.imageUrl}
                    alt={`object-${item.id}`}
                    className="objects-table__thumbnail"
                  />
                </td>
                <td>{item.tag}</td>
                <td>{item.entropy}</td>
                <td>{item.confidence}</td>
                <td>{item.errorProbability}</td>
                <td>{item.novelty}</td>
                <td>{item.usefulness}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="objects-table__pagination">
          <button
            className="objects-table__pagination-prev"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Назад
          </button>
          <span className="objects-table__pagination-info">
            Страница {currentPage} из {totalPages}
          </span>
          <button
            className="objects-table__pagination-next"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
};

export default ObjectsTable;
