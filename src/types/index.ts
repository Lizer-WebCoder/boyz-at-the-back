export type Status = 'in_the_yard' | 'solitary' | 'out_on_bail' | 'on_parole';

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  inmate_id: string;
  status: Status;
  custom_status: string | null;
  bio: string | null;
  created_at?: string;
}

export interface Role {
  id: string;
  name: string;
  color: string;
  position: number;
  permissions?: Record<string, boolean>;
}

export interface Category {
  id: string;
  name: string;
  position: number;
}

export interface Channel {
  id: string;
  category_id: string | null;
  name: string;
  type: 'text' | 'voice';
  is_private: boolean;
  position: number;
  topic: string | null;
  created_by?: string;
}

export interface Message {
  id: string;
  channel_id: string;
  author_id: string;
  content: string | null;
  media_urls: string[] | null;
  reply_to_id: string | null;
  thread_id: string | null;
  is_edited: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
  reactions?: ReactionSummary[];
}

export interface ReactionSummary {
  emoji: string;
  count: number;
  users: string[];
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'blocked';
}
