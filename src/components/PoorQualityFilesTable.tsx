import React, { useState, useMemo } from "react";
import type { PoorQualityFile } from "../types/types";
import './PoorQualityFilesTable.scss';

interface PoorQualityFilesTableProps {
  data: PoorQualityFile[];
}

const PoorQualityFilesTable: React.FC<PoorQualityFilesTableProps> = ({
  data,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof PoorQualityFile | null>(
    null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof PoorQualityFile) => {
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
      item.reason?.toLowerCase().includes(searchQuery.toLowerCase()),
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
    <div className="poor-quality-files-table">
      <div className="poor-quality-files-table__toolbar">
        <div className="poor-quality-files-table__search-icon"></div>
        <input
          type="text"
          className="poor-quality-files-table__search"
          placeholder="Поиск по причине..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="poor-quality-files-table__scroll-wrapper">
        <table className="poor-quality-files-table__table">
          <thead>
            <tr>
              <th onClick={() => handleSort("imageUrl")}>
                Объект
                {sortField === "imageUrl" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </th>
              <th onClick={() => handleSort("reason")}>
                Причина попадания
                {sortField === "reason" &&
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
                    alt={`poor-${item.id}`}
                    className="poor-quality-files-table__thumbnail"
                  />
                </td>
                <td>{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="poor-quality-files-table__pagination">
          <button
            className="poor-quality-files-table__pagination-prev"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Назад
          </button>
          <span className="poor-quality-files-table__pagination-info">
            Страница {currentPage} из {totalPages}
          </span>
          <button
            className="poor-quality-files-table__pagination-next"
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

export default PoorQualityFilesTable;
