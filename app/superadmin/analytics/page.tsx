"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [allReviews, setAllReviews] = useState<any[]>([]);

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

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    let loaded: any[] = [];

    for (const item of brandTables) {
      const res = await fetch(`/api/get-table?table=${item.table}`, { cache: "no-store" });
      const data = await res.json();
      const reviews = data.reviews || [];

      loaded.push(
        ...reviews.map((r: any) => ({
          ...r,
          brand: item.brand,
        }))
      );
    }

    setAllReviews(loaded);
    setLoading(false);
  }

  // -----------------------
  // Rating Count → Radar Chart
  // -----------------------
  const ratingRadarData = [1, 2, 3, 4, 5].map((num) => ({
    rating: `${num}★`,
    count: allReviews.filter((r) => r.rating === num).length,
  }));

  // -----------------------
  // Brand Review Count → Bar Chart
  // -----------------------
  const brandBarData = brandTables.map((b) => ({
    brand: b.brand,
    count: allReviews.filter((r) => r.brand === b.brand).length,
  }));

  // -----------------------
  // Games Count → Bar Chart
  // -----------------------
  const gameCountMap: any = {};

  allReviews.forEach((r) => {
    if (!r.games) return;
    const arr = r.games.split(",").map((x: string) => x.trim());
    arr.forEach((g: string) => {
      if (!g) return;
      gameCountMap[g] = (gameCountMap[g] || 0) + 1;
    });
  });

  const gamesBarData = Object.keys(gameCountMap).map((g) => ({
    game: g,
    count: gameCountMap[g],
  }));

  // -----------------------
  // Experiences Count → Bar Chart
  // -----------------------
  const expCountMap: any = {};

  allReviews.forEach((r) => {
    if (!r.experiences) return;
    const arr = r.experiences.split(",").map((x: string) => x.trim());
    arr.forEach((e: string) => {
      if (!e) return;
      expCountMap[e] = (expCountMap[e] || 0) + 1;
    });
  });

  const expBarData = Object.keys(expCountMap).map((e) => ({
    exp: e,
    count: expCountMap[e],
  }));

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Analytics Dashboard
        </h1>

        <button
          onClick={() => router.push("/superadmin")}
          className="bg-gray-800 text-white px-5 py-3 rounded-xl shadow hover:bg-gray-900"
        >
          ← Back
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Radar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Rating Distribution (Radar)</h2>

            <ResponsiveContainer width="100%" height={350}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ratingRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="rating" />
                <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                <Radar
                  name="Ratings"
                  dataKey="count"
                  stroke="#3A0CA3"
                  fill="#7209B7"
                  fillOpacity={0.7}
                />
              </RadarChart>
            </ResponsiveContainer>

            <ul className="mt-4 space-y-1 text-gray-700">
              {ratingRadarData.map((d) => (
                <li key={d.rating}>
                  {d.rating}: {d.count}
                </li>
              ))}
            </ul>
          </div>

          {/* Brand Count */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Brand Review Count (Bar)</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={brandBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brand" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4361EE" />
              </BarChart>
            </ResponsiveContainer>

            <ul className="mt-4 space-y-1 text-gray-700">
              {brandBarData.map((d) => (
                <li key={d.brand}>{d.brand}: {d.count}</li>
              ))}
            </ul>
          </div>

          {/* Games Count */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Games Count (Bar)</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gamesBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="game" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FF6B6B" />
              </BarChart>
            </ResponsiveContainer>

            <ul className="mt-4 space-y-1 text-gray-700">
              {gamesBarData.map((d) => (
                <li key={d.game}>{d.game}: {d.count}</li>
              ))}
            </ul>
          </div>

          {/* Experiences Count */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Experiences Count (Bar)</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="exp" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FFA600" />
              </BarChart>
            </ResponsiveContainer>

            <ul className="mt-4 space-y-1 text-gray-700">
              {expBarData.map((d) => (
                <li key={d.exp}>{d.exp}: {d.count}</li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
