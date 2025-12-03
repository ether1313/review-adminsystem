"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewsTable from "../admin/dashboard/ReviewsTable";
import TopNav from "../admin/dashboard/TopNav";

// Chart.js
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

  // LOAD ALL BRAND TABLES
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

  // FILTER REVIEWS
  const filterReviews = (reviews: any[]) => {
    if (filterRating === "all") return reviews;
    return reviews.filter((r: any) => r.rating === Number(filterRating));
  };

  // EXPORT CSV
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

  // ============================================================
  // SUMMARY CALCULATIONS
  // ============================================================

  const brandNames = brandTables.map((b) => b.brand);
  const reviewCounts = brandTables.map(
    (b) => allReviews[b.table]?.length || 0
  );

  // Colors for brand bars
  const brandColors = [
    "#4dc9f6",
    "#f67019",
    "#f53794",
    "#537bc4",
    "#acc236",
    "#166a8f",
    "#00a950",
    "#58595b",
    "#8549ba",
    "#ffa600",
  ];

  const avgRatings = brandTables.map((b) => {
    const rows = allReviews[b.table] || [];
    if (!rows.length) return 0;
    const sum = rows.reduce((acc: any, r: any) => acc + r.rating, 0);
    return Number((sum / rows.length).toFixed(2));
  });

  // Bar chart data
  const barData = {
    labels: brandNames,
    datasets: [
      {
        label: "Total Reviews",
        data: reviewCounts,
        backgroundColor: brandColors,
      },
    ],
  };

  // Radar chart data
  const radarData = {
    labels: brandNames,
    datasets: [
      {
        label: "Average Experiences Score",
        data: avgRatings,
        backgroundColor: "rgba(75, 192, 255, 0.25)",
        borderColor: "rgba(75, 192, 255, 1)",
      },
    ],
  };

  // Summary — Total reviews
  const totalReviewsAllBrands = reviewCounts.reduce((a, b) => a + b, 0);

  // Summary — Global average rating
  let allRatings: number[] = [];
  brandTables.forEach((b) => {
    (allReviews[b.table] || []).forEach((r: any) =>
      allRatings.push(r.rating)
    );
  });

  const globalAverageRating = allRatings.length
    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2)
    : "0.00";

  // Summary — Highest rated brand
  const sortedBrands = brandTables
    .map((b) => {
      const rows = allReviews[b.table] || [];
      if (!rows.length) return null;
      const avg =
        rows.reduce((sum: any, r: any) => sum + r.rating, 0) / rows.length;
      return { brand: b.brand, rating: avg };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.rating - a.rating);

  const top1 = sortedBrands[0] || null;
  const top2 = sortedBrands[1] || null;
  const top3 = sortedBrands[2] || null;

  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          SuperAdmin Dashboard
        </h1>

        {/* =================== SUMMARY CARDS =================== */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          <div className="p-5 bg-white shadow-sm border rounded-xl">
            <h3 className="text-gray-500 text-xs md:text-sm">Total Reviews</h3>
            <p className="text-2xl md:text-3xl font-bold mt-2">
              {totalReviewsAllBrands}
            </p>
          </div>

          <div className="p-5 bg-white shadow-sm border rounded-xl">
            <h3 className="text-gray-500 text-xs md:text-sm">
              Global Average Rating
            </h3>
            <p className="text-2xl md:text-3xl font-bold mt-2">
              {globalAverageRating}
            </p>
          </div>

          <div className="p-5 bg-white shadow-sm border rounded-xl">
            <h3 className="text-gray-500 text-xs md:text-sm">
              Highest Rated Brand
            </h3>
            <p className="text-lg font-semibold mt-1">{top1?.brand || "-"}</p>
            <p className="text-gray-600 text-xs">
              Avg Rating: {top1?.rating?.toFixed(2)}
            </p>
          </div>

          <div className="p-5 bg-white shadow-sm border rounded-xl">
            <h3 className="text-gray-500 text-xs md:text-sm">
              Top Games Rated
            </h3>
            <p className="text-base font-semibold mt-1">
              2nd: {top2?.brand || "-"}
            </p>
            <p className="text-base font-semibold">3rd: {top3?.brand || "-"}</p>
          </div>
        </section>

        {/* ==================== CHARTS ==================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-5 bg-white shadow-sm border rounded-xl">
            <h2 className="text-lg font-semibold mb-3">
              Total Reviews per Brand
            </h2>
            <div className="h-[180px] md:h-[220px]">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { ticks: { font: { size: 10 } } },
                    x: { ticks: { font: { size: 10 } } },
                  },
                }}
              />
            </div>
          </div>

          <div className="p-5 bg-white shadow-sm border rounded-xl">
            <h2 className="text-lg font-semibold mb-3">
              Average Experiences Overview
            </h2>
            <div className="h-[180px] md:h-[220px]">
              <Radar
                data={radarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    r: {
                      angleLines: { display: false },
                      grid: { color: "rgba(0,0,0,0.1)" },
                      pointLabels: { font: { size: 10 } },
                    },
                  },
                }}
              />
            </div>
          </div>
        </section>

        {/* FILTER */}
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

        {/* TABLES */}
        {!loading &&
          brandTables.map((item) => {
            const tableReviews = filterReviews(allReviews[item.table] || []);

            return (
              <div key={item.table} className="mb-12">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">{item.brand} Reviews</h2>

                  <button
                    onClick={() => exportCSV(item.brand, tableReviews)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Export CSV
                  </button>
                </div>

                <ReviewsTable
                  reviews={tableReviews}
                  onSort={() => {}}
                  sortColumn={null}
                  sortDirection="asc"
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
