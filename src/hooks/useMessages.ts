import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Message } from '../types';

export function useMessages(channelId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!channelId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select(
        `
        *,
        author:profiles(*),
        reactions:message_reactions(emoji, user_id)
      `
      )
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
      .limit(150);

    if (error) {
      console.warn('Messages fetch error:', error.message);
      setLoading(false);
      return;
    }

    const withReactions = (data || []).map((m: any) => {
      const reactionMap = new Map<string, { count: number; users: string[] }>();
      (m.reactions || []).forEach((r: any) => {
        const existing = reactionMap.get(r.emoji) || { count: 0, users: [] };
        existing.count += 1;
        existing.users.push(r.user_id);
        reactionMap.set(r.emoji, existing);
      });

      return {
        ...m,
        reactions: Array.from(reactionMap.entries()).map(([emoji, val]) => ({
          emoji,
          ...val,
        })),
      } as Message;
    });

    setMessages(withReactions);
    setLoading(false);
  }, [channelId]);

  useEffect(() => {
    fetchMessages();

    if (!channelId) return;

    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        () => {
          fetchMessages();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, fetchMessages]);

  const sendMessage = async (
    content: string,
    replyToId?: string,
    mediaUrls?: string[]
  ) => {
    if (!channelId) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('messages').insert({
      channel_id: channelId,
      author_id: user.id,
      content: content || null,
      reply_to_id: replyToId || null,
      media_urls: mediaUrls || null,
    });

    if (error) throw error;
  };

  const addReaction = async (messageId: string, emoji: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('message_reactions').upsert(
      {
        message_id: messageId,
        user_id: user.id,
        emoji,
      },
      { onConflict: 'message_id,user_id,emoji' }
    );
  };

  const deleteMessage = async (messageId: string) => {
    await supabase.from('messages').delete().eq('id', messageId);
  };

  return {
    messages,
    loading,
    sendMessage,
    addReaction,
    deleteMessage,
    refresh: fetchMessages,
  };
}
