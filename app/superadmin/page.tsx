"use client";

import { useEffect, useState, useMemo } from "react";
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

  // 10 brands
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

  // Logout
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.setItem("logoutSuccess", "true");
    router.replace("/");
  };

  // Verify superadmin
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

  // Load all tables
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

  // Rating filter
  const filterReviews = (reviews: any[]) => {
    if (filterRating === "all") return reviews;
    return reviews.filter((r: any) => r.rating === Number(filterRating));
  };

  // Export CSV
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

  // ---------------- SUMMARY ----------------
  const brandNames = brandTables.map((b) => b.brand);
  const reviewCounts = brandTables.map((b) => allReviews[b.table]?.length || 0);
  const totalReviewsAllBrands = reviewCounts.reduce((a, b) => a + b, 0);

  // Global avg rating
  let allRatings: number[] = [];
  brandTables.forEach((b) => {
    (allReviews[b.table] || []).forEach((r: any) => allRatings.push(r.rating));
  });

  const globalAverageRating = allRatings.length
    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2)
    : "0.00";

  // Highest rated brand
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

  // ---------------- Top Games Frequency ----------------
  const topGame = useMemo(() => {
    let freq: any = {};

    brandTables.forEach((b) => {
      const rows = allReviews[b.table] || [];

      rows.forEach((r: any) => {
        if (r.games) {
          r.games.split(",").forEach((g: string) => {
            const key = g.trim();
            if (key) freq[key] = (freq[key] || 0) + 1;
          });
        }
      });
    });

    const top = Object.entries(freq).sort((a: any, b: any) => b[1] - a[1])[0];
    return top ? `${top[0]} (${top[1]})` : "-";
  }, [allReviews]);

  // ---------------- Experiences Frequency (Radar) ----------------
  const experienceRadar = useMemo(() => {
    let freq: any = {};

    brandTables.forEach((b) => {
      const rows = allReviews[b.table] || [];

      rows.forEach((r: any) => {
        if (!r.experiences) return;
        r.experiences.split(",").forEach((exp: string) => {
          const key = exp.trim();
          if (key) freq[key] = (freq[key] || 0) + 1;
        });
      });
    });

    const sorted = Object.entries(freq).sort((a: any, b: any) => b[1] - a[1]);
    const top10 = sorted.slice(0, 10);

    return {
      labels: top10.map((x) => x[0]),
      data: top10.map((x) => x[1]),
    };
  }, [allReviews]);

  const radarData = {
    labels: experienceRadar.labels,
    datasets: [
      {
        label: "Experiences Frequency",
        data: experienceRadar.data,
        backgroundColor: "rgba(75, 192, 255, 0.20)",
        borderColor: "rgba(75, 192, 255, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 255, 1)",
      },
    ],
  };

  // ---------------- Bar Chart ----------------
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

  const barData = {
    labels: brandNames,
    datasets: [
      {
        label: "",
        data: reviewCounts,
        backgroundColor: brandColors,
      },
    ],
  };

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-20">

        {/* PAGE TITLE */}
        <h1 className="text-xl md:text-3xl font-bold mb-6">
          SuperAdmin Dashboard
        </h1>

        {/* SUMMARY CARDS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          {[
            { label: "Total Reviews", value: totalReviewsAllBrands },
            { label: "Global Average Rating", value: globalAverageRating },
            { label: "Highest Rated Brand", value: top1?.brand || "-" },
            { label: "Top Games Frequency", value: topGame },
          ].map((card, i) => (
            <div
              key={i}
              className="p-4 md:p-6 bg-white border border-gray-200 rounded-xl"
            >
              <h3 className="text-gray-500 text-xs md:text-sm">{card.label}</h3>
              <p className="text-xl md:text-3xl font-semibold mt-2">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        {/* CHARTS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Bar Chart */}
          <div className="p-4 md:p-6 bg-white border border-gray-200 rounded-xl">
            <h2 className="text-lg font-semibold mb-3">
              Total Reviews per Brand
            </h2>
            <div className="h-[220px] md:h-[260px]">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      grid: { color: "rgba(0,0,0,0.05)" },
                      ticks: { font: { size: 9 } },
                    },
                    x: {
                      grid: { display: false },
                      ticks: { font: { size: 9 } },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Radar Chart */}
          <div className="p-4 md:p-6 bg-white border border-gray-200 rounded-xl">
            <h2 className="text-lg font-semibold mb-3">
              Experiences Frequency Overview
            </h2>
            <div className="h-[220px] md:h-[260px]">
              <Radar
                data={radarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    r: {
                      angleLines: { color: "rgba(0,0,0,0.05)" },
                      grid: { color: "rgba(0,0,0,0.05)" },
                      pointLabels: { font: { size: 8 } },
                      ticks: { display: false },
                    },
                  },
                }}
              />
            </div>
          </div>
        </section>

        {/* Filter */}
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

        {/* Tables */}
        {!loading &&
          brandTables.map((item) => {
            const tableReviews = filterReviews(allReviews[item.table] || []);

            return (
              <div key={item.table} className="mb-12">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">{item.brand} Reviews</h2>

                  <button
                    onClick={() => exportCSV(item.brand, tableReviews)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg"
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
