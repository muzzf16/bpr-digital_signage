import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DataTable = ({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  emptyMessage = "No data available",
  className = ""
}) => {
  // Memoize the table rows to prevent unnecessary re-renders
  const renderTableRows = () => data.map((row, rowIndex) => (
    <tr key={rowIndex} className="admin-data-table-tr hover:bg-white/5 transition-colors">
      {columns.map((col, colIndex) => {
        const value = row[col.key];
        return (
          <td key={colIndex} className="admin-data-table-td">
            {col.render ? col.render(value, row) : value}
          </td>
        );
      })}
      <td className="admin-data-table-td text-right text-sm">
        <div className="flex justify-end space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(row)}
              className="p-1 text-blue-300 hover:text-blue-100 transition-colors"
              aria-label="Edit"
              title="Edit"
            >
              <FaEdit />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(row)}
              className="p-1 text-red-300 hover:text-red-100 transition-colors"
              aria-label="Delete"
              title="Delete"
            >
              <FaTrash />
            </button>
          )}
        </div>
      </td>
    </tr>
  ));

  return (
    <div className={`table-wrapper ${className}`}>
      <table className="admin-data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="admin-data-table-th"
              >
                {col.header}
              </th>
            ))}
            <th className="admin-data-table-th text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            renderTableRows()
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="admin-data-table-td text-center"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;