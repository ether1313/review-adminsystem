'use client';

import { useState, useMemo, useRef, useEffect } from "react";

interface Review {
  id: number;
  name: string;
  casino_wallet: string;
  games: string;
  experiences: string;
  rating: number;
  others: string;
  created_at: string;
}

interface ReviewsTableProps {
  reviews: Review[];
  onSort: (column: keyof Review) => void;
  sortColumn: keyof Review | null;
  sortDirection: 'asc' | 'desc';
}

export default function ReviewsTable({ reviews, onSort, sortColumn, sortDirection }: ReviewsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const tableRef = useRef<HTMLDivElement | null>(null);

  const totalPages = Math.ceil(reviews.length / pageSize);

  const scrollToTop = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /** Sorting → always reset to page 1 */
  useEffect(() => {
    setCurrentPage(1);
  }, [sortColumn, sortDirection]);

  /** Slice for pagination */
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return reviews.slice(start, start + pageSize);
  }, [reviews, currentPage, pageSize]);

  /** Pagination window */
  const getVisiblePages = () => {
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  const renderStars = (r: number) =>
    "★".repeat(r) + "☆".repeat(5 - r);

  const renderSortIcon = (column: keyof Review) => {
    if (sortColumn !== column)
      return <i className="ri-arrow-up-down-line ml-1 text-gray-400 text-xs" />;

    return sortDirection === "asc"
      ? <i className="ri-arrow-up-line ml-1 text-xs" />
      : <i className="ri-arrow-down-line ml-1 text-xs" />;
  };

  return (
    <>
      {/* TABLE */}
      <div ref={tableRef} className="bg-white rounded-lg border shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-blue-500">

                <th onClick={() => onSort('name')}
                    className="px-4 py-3 cursor-pointer whitespace-nowrap text-blue-600 font-semibold hover:bg-blue-50">
                  <div className="flex items-center">Name {renderSortIcon('name')}</div>
                </th>

                <th onClick={() => onSort('casino_wallet')}
                    className="px-4 py-3 cursor-pointer whitespace-nowrap text-blue-600 font-semibold hover:bg-blue-50">
                  <div className="flex items-center">Casino Wallet {renderSortIcon('casino_wallet')}</div>
                </th>

                <th onClick={() => onSort('games')}
                    className="px-4 py-3 cursor-pointer whitespace-nowrap text-blue-600 font-semibold hover:bg-blue-50">
                  <div className="flex items-center">Games {renderSortIcon('games')}</div>
                </th>

                <th onClick={() => onSort('experiences')}
                    className="px-4 py-3 cursor-pointer whitespace-nowrap text-blue-600 font-semibold hover:bg-blue-50">
                  <div className="flex items-center">Experiences {renderSortIcon('experiences')}</div>
                </th>

                <th onClick={() => onSort('rating')}
                    className="px-4 py-3 cursor-pointer whitespace-nowrap text-blue-600 font-semibold hover:bg-blue-50">
                  <div className="flex items-center">Rating {renderSortIcon('rating')}</div>
                </th>

                <th onClick={() => onSort('others')}
                    className="px-4 py-3 cursor-pointer whitespace-nowrap text-blue-600 font-semibold hover:bg-blue-50">
                  <div className="flex items-center">Others {renderSortIcon('others')}</div>
                </th>

                <th onClick={() => onSort('created_at')}
                    className="px-4 py-3 cursor-pointer whitespace-nowrap text-blue-600 font-semibold hover:bg-blue-50">
                  <div className="flex items-center">Created At {renderSortIcon('created_at')}</div>
                </th>

              </tr>
            </thead>

            <tbody>
              {paginated.map((r, i) => (
                <tr key={r.id}
                    className={`border-b hover:bg-blue-50 transition ${
                      i % 2 ? "bg-blue-50/20" : "bg-white"
                    }`}>

                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.casino_wallet}</td>
                  <td className="px-4 py-3">{r.games}</td>
                  <td className="px-4 py-3 max-w-md">{r.experiences}</td>
                  <td className="px-4 py-3 text-yellow-500">{renderStars(r.rating)}</td>
                  <td className="px-4 py-3">{r.others}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reviews.length === 0 && (
          <div className="py-8 text-center text-gray-500">No reviews found.</div>
        )}
      </div>

      {/* PAGINATION */}
      {!!reviews.length && (
        <div
          className="
            mt-6 bg-white border-t border-gray-200 px-3 py-4 
            flex flex-col gap-4
            sm:flex-row sm:items-center sm:justify-between
          "
        >

          {/* ROWS SELECT */}
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-sm text-gray-600 font-medium">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
                scrollToTop();
              }}
              className="border rounded-md px-2 py-1 text-sm focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* PAGINATION BUTTONS */}
          <div className="flex items-center justify-center gap-1">

            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => { setCurrentPage(p => p - 1); scrollToTop(); }}
              className={`w-8 h-8 flex items-center justify-center border rounded-md
                ${currentPage === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:border-blue-500 hover:text-blue-600"}`
              }
            >
              ‹
            </button>

            {/* 1 ... */}
            {currentPage > 3 && (
              <>
                <button
                  onClick={() => { setCurrentPage(1); scrollToTop(); }}
                  className="w-8 h-8 border rounded-md hover:border-blue-500 hover:text-blue-600"
                >
                  1
                </button>
                <span className="text-gray-400 px-1">…</span>
              </>
            )}

            {/* middle */}
            {visiblePages.map(p => (
              <button
                key={p}
                onClick={() => { setCurrentPage(p); scrollToTop(); }}
                className={`w-8 h-8 rounded-md text-sm border
                  ${p === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:border-blue-500 hover:text-blue-600"
                  }`}
              >
                {p}
              </button>
            ))}

            {/* ... last */}
            {currentPage < totalPages - 2 && (
              <>
                <span className="text-gray-400 px-1">…</span>
                <button
                  onClick={() => { setCurrentPage(totalPages); scrollToTop(); }}
                  className="w-8 h-8 border rounded-md hover:border-blue-500 hover:text-blue-600"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => { setCurrentPage(p => p + 1); scrollToTop(); }}
              className={`w-8 h-8 flex items-center justify-center border rounded-md
                ${currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:border-blue-500 hover:text-blue-600"}`
              }
            >
              ›
            </button>
          </div>

          {/* PAGE COUNT */}
          <div className="text-sm text-gray-700 font-medium text-center sm:text-right">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </>
  );
}
