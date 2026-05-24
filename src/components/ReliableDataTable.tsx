import React, { useState, useMemo } from "react";
import type { ReliableData } from "../types/types";
import './ReliableDataTable.scss';

interface ReliableDataTableProps {
  data: ReliableData[];
}

const ReliableDataTable: React.FC<ReliableDataTableProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof ReliableData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof ReliableData) => {
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
    <div className="reliable-data-table">
      <div className="reliable-data-table__toolbar">
        <div className="reliable-data-table__search-icon"></div>
        <input
          type="text"
          className="reliable-data-table__search"
          placeholder="Поиск по тегу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="reliable-data-table__scroll-wrapper">
        <table className="reliable-data-table__table">
          <thead>
            <tr>
              <th onClick={() => handleSort("imageUrl")}>
                Объект
                {sortField === "imageUrl" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th onClick={() => handleSort("usefulness")}>
                Полезность дообучения
                {sortField === "usefulness" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th onClick={() => handleSort("tag")}>
                Тег
                {sortField === "tag" && (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.imageUrl}
                    alt={`reliable-${item.id}`}
                    className="reliable-data-table__thumbnail"
                  />
                </td>
                <td>{item.usefulness}</td>
                <td>{item.tag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="reliable-data-table__pagination">
          <button
            className="reliable-data-table__pagination-prev"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Назад
          </button>
          <span className="reliable-data-table__pagination-info">
            Страница {currentPage} из {totalPages}
          </span>
          <button
            className="reliable-data-table__pagination-next"
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

export default ReliableDataTable;
