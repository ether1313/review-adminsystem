"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewsTable from "../admin/dashboard/ReviewsTable";
import TopNav from "../admin/dashboard/TopNav";

// Chart imports
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function SuperAdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allReviews, setAllReviews] = useState<any>({});
  const [filterRating, setFilterRating] = useState("all");

  const brandTables = [
    { brand: "iPay9", table: "ipay9_review" },
    { brand: "Kingbet9", table: "kingbet9_review" },
    { brand: "BP77", table: "bp77_review" },
    { brand: "Me99", table: "me99_review" },
    { brand: "Gucci9", table: "gucci9_review" },
    { brand: "Mrbean9", table: "mrbean9_review" },
    { brand: "Pokemon13", table: "pokemon13_review" },
    { brand: "Bugatti13", table: "bugatti13_review" },
    { brand: "Rolex9", table: "rolex9_review" },
    { brand: "Bybid9", table: "bybid9_review" },
  ];

  // LOGOUT
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.setItem("logoutSuccess", "true");
    router.replace("/");
  };

  // VERIFY SUPERADMIN
  useEffect(() => {
    async function verify() {
      const res = await fetch("/api/check-superadmin", { cache: "no-store" });
      const data = await res.json();

      if (!data.superadmin) {
        router.replace("/");
        return;
      }
      loadAllTables();
    }
    verify();
  }, []);

  // LOAD ALL TABLE DATA
  async function loadAllTables() {
    let results: any = {};

    for (const item of brandTables) {
      const res = await fetch(`/api/get-table?table=${item.table}`, {
        cache: "no-store",
      });
      const data = await res.json();
      results[item.table] = data.reviews || [];
    }

    setAllReviews(results);
    setLoading(false);
  }

  const filterReviews = (reviews: any[]) => {
    if (filterRating === "all") return reviews;
    return reviews.filter((r: any) => r.rating === Number(filterRating));
  };

  const exportCSV = (brand: string, rows: any[]) => {
    if (!rows.length) return;

    const header = Object.keys(rows[0]).join(",");
    const body = rows.map((r) =>
      Object.values(r)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [header, ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${brand}_reviews.csv`;
    link.click();
  };

  // ============================================
  // BUILD CHART DATA
  // ============================================

  const brandNames = brandTables.map((b) => b.brand);

  const reviewCounts = brandTables.map(
    (b) => allReviews[b.table]?.length || 0
  );

  const avgRatings = brandTables.map((b) => {
    const rows = allReviews[b.table] || [];
    if (!rows.length) return 0;
    const sum = rows.reduce((acc: any, r: any) => acc + r.rating, 0);
    return (sum / rows.length).toFixed(2);
  });

  // Different colors for each bar
  const barColors = [
    "#4dc9f6", "#f67019", "#f53794", "#537bc4", "#acc236",
    "#166a8f", "#00a950", "#58595b", "#8549ba", "#e8c547"
  ];

  const barData = {
    labels: brandNames,
    datasets: [
      {
        label: "Total Reviews",
        data: reviewCounts,
        backgroundColor: barColors,
      },
    ],
  };

  const radarData = {
    labels: brandNames,
    datasets: [
      {
        label: "Average Experience Rating",
        data: avgRatings,
        backgroundColor: "rgba(54, 162, 235, 0.35)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  };

  // ============================================
  // SUMMARY CARD CALCULATIONS
  // ============================================

  // Total reviews across all brands
  const totalReviewsAllBrands = brandTables.reduce((acc, b) => {
    return acc + (allReviews[b.table]?.length || 0);
  }, 0);

  // Global average rating
  let allRatings: number[] = [];
  brandTables.forEach((b) => {
    const rows = allReviews[b.table] || [];
    rows.forEach((r: any) => allRatings.push(r.rating));
  });

  const globalAverageRating = allRatings.length
    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2)
    : "0.00";

  // Rank brands by rating
  const brandRankings = brandTables
    .map((b) => {
      const rows = allReviews[b.table] || [];
      if (!rows.length) return { brand: b.brand, rating: 0 };
      const avg =
        rows.reduce((sum: any, r: any) => sum + r.rating, 0) / rows.length;
      return { brand: b.brand, rating: avg };
    })
    .sort((a, b) => b.rating - a.rating);

  const top1 = brandRankings[0];
  const top2 = brandRankings[1];
  const top3 = brandRankings[2];

  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-20">

        {/* PAGE TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6">SuperAdmin Dashboard</h1>

        {/* =================== SUMMARY CARDS =================== */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">

          <div className="p-5 bg-white shadow rounded-xl">
            <h3 className="text-gray-500 text-sm">Total Reviews (10 Brands)</h3>
            <p className="text-2xl md:text-3xl font-bold mt-2">{totalReviewsAllBrands}</p>
          </div>

          <div className="p-5 bg-white shadow rounded-xl">
            <h3 className="text-gray-500 text-sm">Global Avg Rating</h3>
            <p className="text-2xl md:text-3xl font-bold mt-2">{globalAverageRating}</p>
          </div>

          <div className="p-5 bg-white shadow rounded-xl">
            <h3 className="text-gray-500 text-sm">Top Game</h3>
            <p className="text-xl font-semibold mt-1">{top1?.brand || "-"}</p>
            <p className="text-gray-600 text-sm">2nd: {top2?.brand || "-"}</p>
            <p className="text-gray-600 text-sm">3rd: {top3?.brand || "-"}</p>
          </div>

          <div className="p-5 bg-white shadow rounded-xl">
            <h3 className="text-gray-500 text-sm">Brands Count</h3>
            <p className="text-2xl md:text-3xl font-bold mt-2">10</p>
          </div>

        </section>

        {/* ==================== DATA VISUALIZATION ==================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          <div className="p-6 bg-white shadow rounded-xl">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Total Reviews per Brand
            </h2>
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </div>

          <div className="p-6 bg-white shadow rounded-xl">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Average Experiences Overview
            </h2>
            <Radar
              data={radarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </div>

        </section>

        {/* ==================== FILTER ==================== */}
        <div className="mb-6">
          <label className="text-gray-700 font-medium mr-3">
            Filter rating:
          </label>
          <select
            className="border px-3 py-2 rounded-lg"
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">★★★★★</option>
            <option value="4">★★★★</option>
            <option value="3">★★★</option>
            <option value="2">★★</option>
            <option value="1">★</option>
          </select>
        </div>

        {/* ==================== REVIEWS TABLES ==================== */}
        {!loading &&
          brandTables.map((item) => {
            const tableReviews = filterReviews(allReviews[item.table] || []);

            return (
              <div key={item.table} className="mb-12">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-3">
                  <h2 className="text-xl md:text-2xl font-semibold">{item.brand} Reviews</h2>

                  <button
                    onClick={() => exportCSV(item.brand, tableReviews)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Export CSV
                  </button>
                </div>

                <div className="bg-white shadow rounded-xl p-3 md:p-5">
                  <ReviewsTable
                    reviews={tableReviews}
                    onSort={() => {}}
                    sortColumn={null}
                    sortDirection="asc"
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
