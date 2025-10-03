import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  color: string;
  online: boolean;
  statusMessage?: string;
  profilePicture?: string;
  lastSeen?: number;
  position?: [number, number, number];
}

interface UserState {
  users: User[];
  onlineUsers: Set<string>;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  setOnlineStatus: (userId: string, online: boolean) => void;
  updateUserPosition: (userId: string, position: [number, number, number]) => void;
  updateUserColor: (userId: string, color: string) => void;
  updateUserProfile: (userId: string, updates: Partial<User>) => void;
  setStatusMessage: (userId: string, statusMessage: string) => void;
  getOnlineUsers: () => User[];
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  onlineUsers: new Set<string>(),

  addUser: (user) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== user.id).concat({
        ...user,
        online: user.online ?? false,
      }),
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
      onlineUsers: new Set([...state.onlineUsers].filter((id) => id !== userId)),
    })),

  setOnlineStatus: (userId, online) =>
    set((state) => {
      const newOnlineUsers = new Set(state.onlineUsers);
      if (online) {
        newOnlineUsers.add(userId);
      } else {
        newOnlineUsers.delete(userId);
      }

      return {
        users: state.users.map((user) =>
          user.id === userId
            ? { ...user, online, lastSeen: online ? undefined : Date.now() }
            : user
        ),
        onlineUsers: newOnlineUsers,
      };
    }),

  updateUserPosition: (userId, position) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, position } : user
      ),
    })),

  updateUserColor: (userId, color) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, color } : user
      ),
    })),

  updateUserProfile: (userId, updates) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      ),
    })),

  setStatusMessage: (userId, statusMessage) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, statusMessage } : user
      ),
    })),

  getOnlineUsers: () => {
    const state = get();
    return state.users.filter((user) => state.onlineUsers.has(user.id));
  },
}));
