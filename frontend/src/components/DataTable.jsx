import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const DataTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-blue-700/50">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-blue-700/30">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-white/5 transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-4 py-3 text-sm text-white">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              <td className="px-4 py-3 text-right text-sm">
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => onEdit && onEdit(row)}
                    className="p-1 text-blue-300 hover:text-blue-100 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => onDelete && onDelete(row)}
                    className="p-1 text-red-300 hover:text-red-100 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
