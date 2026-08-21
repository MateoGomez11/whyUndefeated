import { verifyAdminSession } from '@/lib/admin/auth';
import { getSupabaseClient } from '@/lib/alternatives/client';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Console',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAuth = await verifyAdminSession();
  let alternatives = [];

  if (isAuth) {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from('community_alternatives')
        .select('*')
        .order('created_at', { ascending: false });
      alternatives = data || [];
    }
  }

  return (
    <main
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-4)',
      }}
    >
      <AdminDashboard initialAlternatives={alternatives} isAuthenticated={isAuth} />
    </main>
  );
}
