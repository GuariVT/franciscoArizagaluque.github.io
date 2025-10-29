import { supabase } from '../lib/supabase';

export async function cleanupExpiredEvents() {
  try {
    const now = new Date().toISOString();

    const { data: expiredEvents, error: selectError } = await supabase
      .from('events')
      .select('id')
      .lt('event_date', now);

    if (selectError) {
      console.error('Error fetching expired events:', selectError);
      return;
    }

    if (!expiredEvents || expiredEvents.length === 0) {
      return;
    }

    const expiredEventIds = expiredEvents.map((event) => event.id);

    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .in('id', expiredEventIds);

    if (deleteError) {
      console.error('Error deleting expired events:', deleteError);
    } else {
      console.log(`Cleaned up ${expiredEventIds.length} expired event(s)`);
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}
