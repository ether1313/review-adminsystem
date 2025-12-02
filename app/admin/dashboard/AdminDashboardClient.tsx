'use client';

import { useEffect, useState, useRef } from 'react';
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

  // Notification State
  const [newReviewNotification, setNewReviewNotification] = useState(false);

  // Sound reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 从 Supabase 拉取对应 table 的数据
  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase
        .from(reviewTable)
        .select('*')
        .order('id', { ascending: false });

      if (!error) {
        setReviews(data as Review[]);
      }
      setIsLoading(false);
    };

    loadData();
  }, [reviewTable]);

  // Realtime subscription for new reviews
  useEffect(() => {
    if (!reviewTable) return;

    // 加载音效
    audioRef.current = new Audio("/message.mp3");

    const channel = supabase
      .channel(`realtime-${reviewTable}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: reviewTable,
        },
        (payload) => {
          const newReview = payload.new as Review;

          // 新评论插入最前面
          setReviews((prev) => [newReview, ...prev]);

          // 播放声音
          if (audioRef.current) {
            audioRef.current.volume = 1.0;
            audioRef.current.play().catch(() => {});
          }

          // 显示顶部绿色提示
          setNewReviewNotification(true);

          // 3 秒后隐藏
          setTimeout(() => setNewReviewNotification(false), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reviewTable]);

  // Logout API
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });

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

  const exportToCSV = () => {
    if (!filteredAndSortedReviews || filteredAndSortedReviews.length === 0) return;

    const headers = Object.keys(filteredAndSortedReviews[0]).join(",");
    const rows = filteredAndSortedReviews
      .map((row) =>
        Object.values(row)
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const csvContent = [headers, rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reviews.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* 顶部绿色 Notification */}
      {newReviewNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in z-50">
          <span className="font-semibold">New review received!</span>
        </div>
      )}

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

        <div className="flex justify-end mb-4">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Export CSV
          </button>
        </div>

        <ReviewsTable
          reviews={filteredAndSortedReviews}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      </main>

      {/* Notification Animation Style */}
      <style>{`
        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
