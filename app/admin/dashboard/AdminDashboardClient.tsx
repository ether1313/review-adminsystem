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

  // 从 Supabase 拉取对应 table 的数据
  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase
        .from(reviewTable)
        .select('*')
        .order('id', { ascending: true });

      if (!error) {
        setReviews(data as Review[]);
      }
      setIsLoading(false);
    };

    loadData();
  }, [reviewTable]);

  // Logout API
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });

  // 让 login page 能显示 logout notification
  localStorage.setItem("logoutSuccess", "true");

    router.replace("/");
  };

  const handleSort = (column: keyof Review) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      const matchesRating = 
        filterRating === 'All' || review.rating === parseInt(filterRating);
      const matchesSearch =
        searchQuery === '' ||
        review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.casino_wallet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.games.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.experiences.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.others.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesRating && matchesSearch;
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;

      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
            Welcome, {brandName}
          </h2>
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
