'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopNav from './TopNav';
import FilterSection from './FilterSection';
import ReviewsTable from './ReviewsTable';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

export default function AdminDashboardClient({ brandName, reviewTable }: any) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterRating, setFilterRating] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof Review | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase
        .from(reviewTable)
        .select('*')
        .order('id', { ascending: true });

      setReviews(data as Review[]);
      setIsLoading(false);
    };

    loadData();
  }, [reviewTable]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });

    localStorage.setItem("logoutSuccess", "true");
    router.replace("/");
  };

  const handleSort = (column: keyof Review) => {
    if (sortColumn === column) {
      setSortDirection(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  /** Export CSV */
  const exportToCSV = () => {
    if (!filteredAndSortedReviews.length) return;

    const headers = Object.keys(filteredAndSortedReviews[0]).join(",");
    const rows = filteredAndSortedReviews
      .map(r =>
        Object.values(r)
          .map(v => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "reviews.csv";
    link.click();
  };

  /** Filtering + Sorting */
  const filteredAndSortedReviews = reviews
    .filter(review => {
      const matchRating =
        filterRating === 'All' || review.rating === parseInt(filterRating);

      const q = searchQuery.toLowerCase();

      const matchSearch =
        q === '' ||
        review.name.toLowerCase().includes(q) ||
        review.casino_wallet.toLowerCase().includes(q) ||
        review.games.toLowerCase().includes(q) ||
        review.experiences.toLowerCase().includes(q) ||
        review.others.toLowerCase().includes(q);

      return matchRating && matchSearch;
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;

      const x = a[sortColumn];
      const y = b[sortColumn];

      if (typeof x === 'string' && typeof y === 'string') {
        return sortDirection === 'asc'
          ? x.localeCompare(y)
          : y.localeCompare(x);
      }

      if (typeof x === 'number' && typeof y === 'number') {
        return sortDirection === 'asc' ? x - y : y - x;
      }

      return 0;
    });

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">

          <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
            Welcome, {brandName}
          </h2>

          {/* Export CSV Button — Mobile Responsive */}
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                       text-sm font-medium w-full sm:w-auto"
          >
            Export CSV
          </button>
        </div>

        <FilterSection
          filterRating={filterRating}
          setFilterRating={setFilterRating}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <ReviewsTable
          reviews={filteredAndSortedReviews}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      </main>
    </div>
  );
}
