'use client';

interface FilterSectionProps {
  filterRating: string;
  setFilterRating: (rating: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function FilterSection({ 
  filterRating, 
  setFilterRating, 
  searchQuery, 
  setSearchQuery 
}: FilterSectionProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 mb-3 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <label htmlFor="rating-filter" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
            Filter:
          </label>
          <select
            id="rating-filter"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer text-gray-700 font-medium text-xs sm:text-base bg-white"
          >
            <option value="All">All Ratings</option>
            <option value="5">5★</option>
            <option value="4">4★</option>
            <option value="3">3★</option>
            <option value="2">2★</option>
            <option value="1">1★</option>
          </select>
        </div>

        <div className="flex-1 sm:max-w-md">
          <div className="relative">
            <i className="ri-search-line absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"></i>
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-base text-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
