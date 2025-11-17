import React from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';

interface CrudTableProps<T> {
  title: string;
  data: T[];
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
  }>;
  // onAdd: () => void;
  onEdit: (item: T) => void;
  // onDelete: (item: T) => void;
  loading?: boolean;
}

export default function CrudTable<T extends { id?: string }>({ 
  title, 
  data, 
  columns, 
  // onAdd, 
  onEdit, 
  // onDelete, 
  loading 
}: CrudTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {/* <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        > */}
          {/* <Plus className="w-4 h-4 mr-2" />
          Add {title.slice(0, -1)}
        </button> */}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                  No {title.toLowerCase()} found. Click "Add {title.slice(0, -1)}" to create one.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render 
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '-')
                      }
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {/* <button
                        onClick={() => onDelete(item)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      > */}
                        {/* <Trash2 className="w-4 h-4" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}