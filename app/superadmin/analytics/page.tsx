"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Chart.js imports
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(
  RadialLinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

export default function AnalyticsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allReviews, setAllReviews] = useState<any[]>([]);

  // Brand + Table map
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

  // Load all tables
  useEffect(() => {
    async function load() {
      let all: any[] = [];

      for (const item of brandTables) {
        const res = await fetch(`/api/get-table?table=${item.table}`, { cache: "no-store" });
        const data = await res.json();

        const mapped = (data.reviews || []).map((r: any) => ({
          ...r,
          brand: item.brand,
        }));

        all.push(...mapped);
      }

      setAllReviews(all);
      setLoading(false);
    }

    load();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-xl font-medium">Loading analytics...</div>
    );

  // -----------------------------
  // CALCULATIONS
  // -----------------------------

  // Rating distribution
  const ratingCount = [1, 2, 3, 4, 5].map(
    (star) => allReviews.filter((r) => r.rating === star).length
  );

  // Brand review count
  const brandCount = brandTables.map((b) => ({
    brand: b.brand,
    count: allReviews.filter((r) => r.brand === b.brand).length,
  }));

  // Games Count
  const gameMap: Record<string, number> = {};
  allReviews.forEach((r) => {
    r.games
      .split(",")
      .map((g: string) => g.trim())
      .forEach((g: string) => {
        if (!gameMap[g]) gameMap[g] = 0;
        gameMap[g]++;
      });
  });
  const gamesLabels = Object.keys(gameMap);
  const gamesValues = Object.values(gameMap);

  // Experiences Count
  const expMap: Record<string, number> = {};
  allReviews.forEach((r) => {
    r.experiences
      .split(",")
      .map((e: string) => e.trim())
      .forEach((e: string) => {
        if (!expMap[e]) expMap[e] = 0;
        expMap[e]++;
      });
  });
  const expLabels = Object.keys(expMap);
  const expValues = Object.values(expMap);

  // Random color generator
  const randomColors = (len: number) =>
    Array.from({ length: len }, () =>
      `hsl(${Math.floor(Math.random() * 360)}, 85%, 55%)`
    );

  return (
    <div className="min-h-screen bg-gray-50 p-5 sm:p-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2">
          Analytics Dashboard
        </h1>

        <button
          onClick={() => router.push("/superadmin")}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-900"
        >
          ← Back
        </button>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Rating Radar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
          <Radar
            data={{
              labels: ["⭐1", "⭐2", "⭐3", "⭐4", "⭐5"],
              datasets: [
                {
                  label: "Count",
                  data: ratingCount,
                  backgroundColor: "rgba(99,102,241,0.3)",
                  borderColor: "rgb(99,102,241)",
                  borderWidth: 2,
                },
              ],
            }}
            options={{ responsive: true }}
          />
          <div className="mt-4 text-sm text-gray-700">
            {ratingCount.map((v, i) => (
              <p key={i}>⭐{i + 1}: {v}</p>
            ))}
          </div>
        </div>

        {/* Brand Review Count */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Reviews per Brand</h2>
          <Bar
            data={{
              labels: brandCount.map((b) => b.brand),
              datasets: [
                {
                  label: "Reviews",
                  data: brandCount.map((b) => b.count),
                  backgroundColor: randomColors(brandCount.length),
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>

        {/* Games Count */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Games Count</h2>
          <Bar
            data={{
              labels: gamesLabels,
              datasets: [
                {
                  label: "Count",
                  data: gamesValues,
                  backgroundColor: randomColors(gamesValues.length),
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>

        {/* Experiences Count */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Experiences Count</h2>
          <Bar
            data={{
              labels: expLabels,
              datasets: [
                {
                  label: "Count",
                  data: expValues,
                  backgroundColor: randomColors(expValues.length),
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>

      </div>
    </div>
  );
}
