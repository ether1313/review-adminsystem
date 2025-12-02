import { cookies } from 'next/headers';
import AdminDashboardClient from './AdminDashboardClient';
import { supabase } from '@/lib/supabase';

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const brandName = cookieStore.get("brand_name")?.value ?? null;
  const reviewTable = cookieStore.get("review_table")?.value ?? null;

  if (!brandName || !reviewTable) {
    return (
      <meta httpEquiv="refresh" content="0;URL=/" />
    );
  }

  const { data: reviews, error } = await supabase
    .from(reviewTable)
    .select('*')
    .order('id', { ascending: false });

  return (
    <AdminDashboardClient
      brandName={brandName}
      reviewTable={reviewTable}
      reviews={reviews ?? []}
    />
  );
}
