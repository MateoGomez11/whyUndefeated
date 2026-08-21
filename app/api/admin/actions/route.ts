import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin/auth';
import { getSupabaseClient } from '@/lib/alternatives/client';

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ success: false, message: 'Database not available' }, { status: 500 });
  }

  try {
    const { action, id, tier, is_verified } = await request.json();

    if (action === 'toggle_verified') {
      const { error } = await supabase
        .from('community_alternatives')
        .update({ is_verified: Boolean(is_verified) })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Verification status updated' });
    }

    if (action === 'update_tier') {
      const { error } = await supabase
        .from('community_alternatives')
        .update({
          verification_tier: tier,
          is_verified: tier === 'verified' || tier === 'priority',
        })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Tier updated' });
    }

    if (action === 'delete') {
      const { error } = await supabase
        .from('community_alternatives')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Alternative deleted' });
    }

    return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    console.error('Admin action error:', err);
    return NextResponse.json({ success: false, message: 'Action failed' }, { status: 500 });
  }
}
