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

  /** 排序后自动跳第一页 */
  useEffect(() => {
    setCurrentPage(1);
  }, [sortColumn, sortDirection]);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return reviews.slice(start, start + pageSize);
  }, [reviews, currentPage, pageSize]);

  const renderStars = (rating: number) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const renderSortIcon = (column: keyof Review) => {
    if (sortColumn !== column) {
      return <i className="ri-arrow-up-down-line ml-1 text-gray-400 text-xs sm:text-base" />;
    }
    return sortDirection === 'asc'
      ? <i className="ri-arrow-up-line ml-1 text-xs sm:text-base" />
      : <i className="ri-arrow-down-line ml-1 text-xs sm:text-base" />;
  };

  /** 页码 collapse（只显示附近5个按钮） */
  const getVisiblePages = () => {
    const delta = 2;
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);
    let pages = [];

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <>
      {/* TABLE */}
      <div ref={tableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-blue-500">

                <th onClick={() => onSort('name')}
                    className="px-4 py-3 cursor-pointer text-sm font-semibold text-blue-600 whitespace-nowrap hover:bg-blue-50">
                  <div className="flex items-center">
                    Name {renderSortIcon('name')}
                  </div>
                </th>

                <th onClick={() => onSort('casino_wallet')}
                    className="px-4 py-3 cursor-pointer text-sm font-semibold text-blue-600 whitespace-nowrap hover:bg-blue-50">
                  <div className="flex items-center">
                    Casino Wallet {renderSortIcon('casino_wallet')}
                  </div>
                </th>

                <th onClick={() => onSort('games')}
                    className="px-4 py-3 cursor-pointer text-sm font-semibold text-blue-600 whitespace-nowrap hover:bg-blue-50">
                  <div className="flex items-center">
                    Games {renderSortIcon('games')}
                  </div>
                </th>

                <th onClick={() => onSort('experiences')}
                    className="px-4 py-3 cursor-pointer text-sm font-semibold text-blue-600 whitespace-nowrap hover:bg-blue-50">
                  <div className="flex items-center">
                    Experiences {renderSortIcon('experiences')}
                  </div>
                </th>

                <th onClick={() => onSort('rating')}
                    className="px-4 py-3 cursor-pointer text-sm font-semibold text-blue-600 whitespace-nowrap hover:bg-blue-50">
                  <div className="flex items-center">
                    Rating {renderSortIcon('rating')}
                  </div>
                </th>

                <th onClick={() => onSort('others')}
                    className="px-4 py-3 cursor-pointer text-sm font-semibold text-blue-600 whitespace-nowrap hover:bg-blue-50">
                  <div className="flex items-center">
                    Others {renderSortIcon('others')}
                  </div>
                </th>

                <th onClick={() => onSort('created_at')}
                    className="px-4 py-3 cursor-pointer text-sm font-semibold text-blue-600 whitespace-nowrap hover:bg-blue-50">
                  <div className="flex items-center">
                    Created At {renderSortIcon('created_at')}
                  </div>
                </th>

              </tr>
            </thead>

            <tbody>
              {paginatedReviews.map((review, i) => (
                <tr key={review.id}
                    className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                    }`}>

                  <td className="px-4 py-3 text-sm">{review.name}</td>
                  <td className="px-4 py-3 text-sm">{review.casino_wallet}</td>
                  <td className="px-4 py-3 text-sm">{review.games}</td>
                  <td className="px-4 py-3 text-sm max-w-md">{review.experiences}</td>
                  <td className="px-4 py-3 text-sm text-yellow-500">{renderStars(review.rating)}</td>
                  <td className="px-4 py-3 text-sm">{review.others}</td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">{review.created_at}</td>
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
      {reviews.length > 0 && (
      <div
        className="max-w-full bg-white border-t border-gray-200 mt-6 py-4 px-3 
                    flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        {/* LEFT: PageSize Selector */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm font-medium">Rows:</span>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setCurrentPage(1);
              scrollToTop();
            }}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm 
                      hover:border-blue-500 focus:border-blue-500 focus:ring-0"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* RIGHT: Pagination Buttons (桌面端右侧、手机端下方) */}
        <div className="flex items-center gap-1">

          {/* Prev Button */}
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => p - 1);
              scrollToTop();
            }}
            className={`w-8 h-8 flex items-center justify-center border rounded-md 
              ${
                currentPage === 1
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:border-blue-500 hover:text-blue-600"
              }`}
          >
            ‹
          </button>

          {/* First page */}
          {currentPage > 3 && (
            <>
              <button
                onClick={() => {
                  setCurrentPage(1);
                  scrollToTop();
                }}
                className="w-8 h-8 border rounded-md hover:border-blue-500 hover:text-blue-600"
              >
                1
              </button>
              <span className="px-2 text-gray-500">...</span>
            </>
          )}

          {/* Middle pages */}
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                scrollToTop();
              }}
              className={`w-8 h-8 rounded-md border text-sm 
                ${
                  page === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:border-blue-500 hover:text-blue-600"
                }`}
            >
              {page}
            </button>
          ))}

          {/* Last page */}
          {currentPage < totalPages - 2 && (
            <>
              <span className="px-2 text-gray-500">...</span>
              <button
                onClick={() => {
                  setCurrentPage(totalPages);
                  scrollToTop();
                }}
                className="w-8 h-8 border rounded-md hover:border-blue-500 hover:text-blue-600"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((p) => p + 1);
              scrollToTop();
            }}
            className={`w-8 h-8 flex items-center justify-center border rounded-md 
              ${
                currentPage === totalPages
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:border-blue-500 hover:text-blue-600"
              }`}
          >
            ›
          </button>
        </div>
      </div>
    )}
    </>
  );
}
