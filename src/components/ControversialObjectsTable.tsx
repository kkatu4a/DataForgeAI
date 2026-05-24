import React, { useState, useMemo } from "react";
import type { ControversialObject } from "../types/types";

interface ControversialObjectsTableProps {
  data: ControversialObject[];
}

const ControversialObjectsTable: React.FC<ControversialObjectsTableProps> = ({
  data,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof ControversialObject | null>(
    null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof ControversialObject) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(
      (item) =>
        item.userLabel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.modelLabel?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
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
    <div className="controversial-objects-table">
      <div className="controversial-objects-table__toolbar">
        <div className="controversial-objects-table__search-icon"></div>
        <input
          type="text"
          className="controversial-objects-table__search"
          placeholder="Поиск по меткам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="controversial-objects-table__scroll-wrapper">
        <table className="controversial-objects-table__table">
          <thead>
            <tr>
              <th onClick={() => handleSort("imageUrl")}>
                Объект
                {sortField === "imageUrl" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th onClick={() => handleSort("userLabel")}>
                Метка пользователя
                {sortField === "userLabel" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th onClick={() => handleSort("modelLabel")}>
                Предполагаемая метка модели
                {sortField === "modelLabel" &&
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
                    alt={`controversial-${item.id}`}
                    className="controversial-objects-table__thumbnail"
                  />
                </td>
                <td>{item.userLabel}</td>
                <td>{item.modelLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="controversial-objects-table__pagination">
          <button
            className="controversial-objects-table__pagination-prev"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Назад
          </button>
          <span className="controversial-objects-table__pagination-info">
            Страница {currentPage} из {totalPages}
          </span>
          <button
            className="controversial-objects-table__pagination-next"
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

export default ControversialObjectsTable;
