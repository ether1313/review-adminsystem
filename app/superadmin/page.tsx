"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewsTable from "../admin/dashboard/ReviewsTable";
import TopNav from "../admin/dashboard/TopNav";

export default function SuperAdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [allReviews, setAllReviews] = useState<any>({});
  const [filterRating, setFilterRating] = useState("all");

  // 10 个品牌及其表名
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

  // superadmin logout（真正安全）
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });

    localStorage.setItem("logoutSuccess", "true");

    router.replace("/"); // replace 可阻挡浏览器 back
  };

  // 验证 superadmin
  useEffect(() => {
    async function verify() {
      const res = await fetch("/api/check-superadmin", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!data.superadmin) {
        router.replace("/");
        return;
      }

      loadAllTables();
    }

    verify();
  }, []);

  // 加载全部 tables
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <TopNav onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 pt-6 pb-20">
        <h1 className="text-3xl font-bold mb-6">SuperAdmin Review Dashboard</h1>

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

        {loading && <p>Loading all tables...</p>}

        {!loading &&
          brandTables.map((item) => {
            const tableReviews = filterReviews(allReviews[item.table] || []);

            return (
              <div key={item.table} className="mb-12">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-2xl font-semibold">{item.brand} Reviews</h2>

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
