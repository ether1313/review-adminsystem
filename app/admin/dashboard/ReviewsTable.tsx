'use client';

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

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-blue-500">
                <th 
                  onClick={() => onSort('name')}
                  className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center">
                    Name
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th 
                  onClick={() => onSort('casino_wallet')}
                  className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center">
                    Casino Wallet
                    {renderSortIcon('casino_wallet')}
                  </div>
                </th>
                <th 
                  onClick={() => onSort('games')}
                  className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center">
                    Games
                    {renderSortIcon('games')}
                  </div>
                </th>
                <th 
                  onClick={() => onSort('experiences')}
                  className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center">
                    Experiences
                    {renderSortIcon('experiences')}
                  </div>
                </th>
                <th 
                  onClick={() => onSort('rating')}
                  className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center">
                    Rating
                    {renderSortIcon('rating')}
                  </div>
                </th>
                <th 
                  onClick={() => onSort('others')}
                  className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center">
                    Others
                    {renderSortIcon('others')}
                  </div>
                </th>
                <th 
                  onClick={() => onSort('created_at')}
                  className="px-3 sm:px-6 py-2.5 sm:py-4 text-left text-xs sm:text-sm font-semibold text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center">
                    Created At
                    {renderSortIcon('created_at')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr
                  key={review.id}
                  className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'
                  }`}
                >
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm font-medium text-gray-800">
                    {review.name}
                  </td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                    {review.casino_wallet}
                  </td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm text-gray-700">
                    {review.games}
                  </td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm text-gray-700 max-w-md">
                    {review.experiences}
                  </td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm">
                    <span className="text-yellow-500 text-sm sm:text-base">
                      {renderStars(review.rating)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm text-gray-700">
                    {review.others}
                  </td>
                  <td className="px-3 sm:px-6 py-2.5 sm:py-4 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                    {review.created_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <i className="ri-inbox-line text-2xl sm:text-3xl mb-2 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mx-auto"></i>
            <p className="text-xs sm:text-sm">No reviews found matching your criteria.</p>
          </div>
        )}
      </div>
    </>
  );
}
