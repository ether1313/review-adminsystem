'use client';

import { useState, useMemo, useRef } from "react";

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

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return reviews.slice(start, start + pageSize);
  }, [reviews, currentPage, pageSize]);

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const renderSortIcon = (column: keyof Review) => {
    if (sortColumn !== column) {
      return <i className="ri-arrow-up-down-line ml-1 sm:ml-2 text-gray-400 text-xs sm:text-base"></i>;
    }
    return sortDirection === 'asc'
      ? <i className="ri-arrow-up-line ml-1 sm:ml-2 text-xs sm:text-base"></i>
      : <i className="ri-arrow-down-line ml-1 sm:ml-2 text-xs sm:text-base"></i>;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      {/* Table wrapper with ref */}
      <div ref={tableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-blue-500">

                {/* 保持你的原本所有 columns，不做任何改动 */}
                <th onClick={() => onSort('name')} className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 whitespace-nowrap">
                  <div className="flex items-center">
                    Name
                    {renderSortIcon('name')}
                  </div>
                </th>

                <th onClick={() => onSort('casino_wallet')} className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 whitespace-nowrap">
                  <div className="flex items-center">
                    Casino Wallet
                    {renderSortIcon('casino_wallet')}
                  </div>
                </th>

                <th onClick={() => onSort('games')} className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 whitespace-nowrap">
                  <div className="flex items-center">
                    Games
                    {renderSortIcon('games')}
                  </div>
                </th>

                <th onClick={() => onSort('experiences')} className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 whitespace-nowrap">
                  <div className="flex items-center">
                    Experiences
                    {renderSortIcon('experiences')}
                  </div>
                </th>

                <th onClick={() => onSort('rating')} className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 whitespace-nowrap">
                  <div className="flex items-center">
                    Rating
                    {renderSortIcon('rating')}
                  </div>
                </th>

                <th onClick={() => onSort('others')} className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 whitespace-nowrap">
                  <div className="flex items-center">
                    Others
                    {renderSortIcon('others')}
                  </div>
                </th>

                <th onClick={() => onSort('created_at')} className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 whitespace-nowrap">
                  <div className="flex items-center">
                    Created At
                    {renderSortIcon('created_at')}
                  </div>
                </th>

              </tr>
            </thead>

            <tbody>
              {paginatedReviews.map((review, index) => (
                <tr key={review.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm font-medium text-gray-800">{review.name}</td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">{review.casino_wallet}</td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm text-gray-700">{review.games}</td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm text-gray-700 max-w-md">{review.experiences}</td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm"><span className="text-yellow-500 text-sm sm:text-base">{renderStars(review.rating)}</span></td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm text-gray-700">{review.others}</td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{review.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <i className="ri-inbox-line text-2xl sm:text-3xl mb-2"></i>
            <p className="text-xs sm:text-sm">No reviews found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* 底部固定的 Pagination（新增） */}
      {reviews.length > 0 && (
        <div className="
          fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur border-t 
          border-gray-300 shadow-lg py-4 px-6 z-50 flex flex-col sm:flex-row 
          sm:items-center sm:justify-between gap-4
        ">
          
          {/* 每页数量 */}
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-sm sm:text-base font-medium">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1);
                scrollToTop();
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page numbers */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => { if (currentPage > 1) { setCurrentPage(p => p - 1); scrollToTop(); } }}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
            >
              <i className="ri-arrow-left-s-line text-lg"></i>
            </button>

            {pages.map((page) => (
              <button
                key={page}
                onClick={() => { setCurrentPage(page); scrollToTop(); }}
                className={`
                  w-9 h-9 text-sm rounded border font-semibold
                  ${page === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-100"}
                `}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => { if (currentPage < totalPages) { setCurrentPage(p => p + 1); scrollToTop(); } }}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
            >
              <i className="ri-arrow-right-s-line text-lg"></i>
            </button>
          </div>

          {/* Page count */}
          <div className="text-gray-700 text-sm sm:text-base font-semibold text-center sm:text-right">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </>
  );
}
