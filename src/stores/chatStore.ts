import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ChatState {
  activeChannelId: string | null;
  typingUsers: Record<string, string[]>; // channelId → usernames
  setActiveChannel: (id: string | null) => void;
  setTyping: (channelId: string, users: string[]) => void;
}

export const useChatStore = create<ChatState>()(
  immer((set) => ({
    activeChannelId: null,
    typingUsers: {},
    setActiveChannel: (id) =>
      set((state) => {
        state.activeChannelId = id;
      }),
    setTyping: (channelId, users) =>
      set((state) => {
        state.typingUsers[channelId] = users;
      }),
  }))
);
