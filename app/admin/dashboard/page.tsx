import { cookies } from 'next/headers';
import AdminDashboardClient from './AdminDashboardClient';
import { supabase } from '@/lib/supabase';

export default async function DashboardPage() {
  // 必须 await
  const cookieStore = await cookies();

  const brandName = cookieStore.get("brand_name")?.value ?? null;
  const reviewTable = cookieStore.get("review_table")?.value ?? null;

  // 没 cookie → 回 login
  if (!brandName || !reviewTable) {
    return (
      <meta httpEquiv="refresh" content="0;URL=/" />
    );
  }

  // 从 supabase 拉数据
  const { data: reviews, error } = await supabase
    .from(reviewTable)
    .select('*')
    .order('id', { ascending: true });

  return (
    <AdminDashboardClient
      brandName={brandName}
      reviewTable={reviewTable}
      reviews={reviews ?? []}
    />
  );
}
