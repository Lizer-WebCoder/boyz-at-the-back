import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Category, Channel } from '../types';

export function useChannels() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);

    const [catRes, chanRes] = await Promise.all([
      supabase.from('categories').select('*').order('position'),
      supabase.from('channels').select('*').order('position'),
    ]);

    if (catRes.data) setCategories(catRes.data);
    if (chanRes.data) setChannels(chanRes.data);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel('channels-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'channels' },
        () => fetchAll()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        () => fetchAll()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  const channelsByCategory = categories.map((cat) => ({
    ...cat,
    channels: channels.filter((c) => c.category_id === cat.id),
  }));

  const uncategorized = channels.filter((c) => !c.category_id);

  return {
    categories,
    channels,
    channelsByCategory,
    uncategorized,
    loading,
    refresh: fetchAll,
  };
}
