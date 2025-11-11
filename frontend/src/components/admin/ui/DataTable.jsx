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
    <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
      {columns.map((col, colIndex) => {
        const value = row[col.key];
        return (
          <td key={colIndex} className="px-4 py-3 text-sm text-white">
            {col.render ? col.render(value, row) : value}
          </td>
        );
      })}
      <td className="px-4 py-3 text-right text-sm">
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
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-blue-700/50">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-700/30">
          {data.length > 0 ? (
            renderTableRows()
          ) : (
            <tr>
              <td 
                colSpan={columns.length + 1} 
                className="px-4 py-6 text-center text-sm text-blue-200"
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