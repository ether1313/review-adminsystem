"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [allData, setAllData] = useState<any[]>([]);

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

  // 验证 superadmin
  useEffect(() => {
    async function verify() {
      const res = await fetch("/api/check-superadmin");
      const data = await res.json();

      if (!data.superadmin) {
        router.replace("/");
        return;
      }

      loadAll();
    }

    verify();
  }, []);

  // 汇总所有 table
  async function loadAll() {
    let combined: any[] = [];

    for (const item of brandTables) {
      const res = await fetch(`/api/get-table?table=${item.table}`);
      const data = await res.json();

      if (data.reviews) {
        combined.push(...data.reviews.map((r: any) => ({
          ...r,
          brand: item.brand,
        })));
      }
    }

    setAllData(combined);
    setLoading(false);
  }

  // Rating 分布统计
  const ratingCount = [1,2,3,4,5].map((r) => ({
    rating: r,
    count: allData.filter((d) => d.rating === r).length,
  }));

  // 品牌 Review 数量
  const brandCount = brandTables.map((t) => ({
    brand: t.brand,
    count: allData.filter((d) => d.brand === t.brand).length,
  }));

  // Games 出现次数
  const gameCount: Record<string, number> = {};
  allData.forEach((item) => {
    if (!item.games) return;
    const games = item.games.split(",").map((g: string) => g.trim());
    games.forEach((g: string) => {
      gameCount[g] = (gameCount[g] || 0) + 1;
    });
  });

  const gameCountArray = Object.entries(gameCount).map(([name, count]) => ({
    name,
    count,
  }));

  // Experiences 出现次数
  const expCount: Record<string, number> = {};
  allData.forEach((item) => {
    if (!item.experiences) return;
    const exps = item.experiences.split(",").map((e: string) => e.trim());
    exps.forEach((e: string) => {
      expCount[e] = (expCount[e] || 0) + 1;
    });
  });

  const expCountArray = Object.entries(expCount).map(([name, count]) => ({
    name,
    count,
  }));

  if (loading) return <p className="p-10 text-xl">Loading analytics...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>

        <button
          onClick={() => router.push("/superadmin")}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Rating Pie Chart */}
      <div className="bg-white shadow p-5 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ratingCount}
              dataKey="count"
              nameKey="rating"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {ratingCount.map((_, index) => (
                <Cell key={index} fill={["#4caf50","#2196f3","#ffeb3b","#ff9800","#f44336"][index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Brand Review Count */}
      <div className="bg-white shadow p-5 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Reviews per Brand</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={brandCount}>
            <XAxis dataKey="brand" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Games Count */}
      <div className="bg-white shadow p-5 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Game Popularity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gameCountArray}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#9333ea" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Experiences Count */}
      <div className="bg-white shadow p-5 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Experiences Popularity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expCountArray}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
