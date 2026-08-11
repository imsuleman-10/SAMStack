'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  isLoading,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  page = 1,
  totalPages = 1,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div className="w-full" style={{ background: 'rgba(17,24,39,0.5)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
      {onSearchChange && (
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <SearchBar
            value={searchValue || ''}
            onChange={onSearchChange}
            placeholder={searchPlaceholder || 'Search...'}
            className="max-w-md"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase text-gray-400 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-6 py-4 font-semibold">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                  <div className="inline-block w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mb-2" />
                  <p>Loading data...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map(row => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b transition-colors ${onRowClick ? 'cursor-pointer hover:bg-white/5' : ''}`}
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                >
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : String((row as any)[col.key] || '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <span className="text-sm text-gray-400">
            Page <span className="font-medium text-white">{page}</span> of <span className="font-medium text-white">{totalPages}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
