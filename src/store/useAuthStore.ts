import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/techpack';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: { email: string; password: string; firstName: string; lastName: string; companyName?: string }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

interface StoredUser extends User {
  passwordHash: string;
}

const hashPassword = (p: string) => btoa(p); // simple mock hash

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        const stored = localStorage.getItem('techpac_users');
        const users: StoredUser[] = stored ? JSON.parse(stored) : [];
        const found = users.find(u => u.email === email && u.passwordHash === hashPassword(password));
        if (!found) return { success: false, error: 'Invalid email or password' };
        const { passwordHash: _ph, ...user } = found;
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      register: ({ email, password, firstName, lastName, companyName }) => {
        const stored = localStorage.getItem('techpac_users');
        const users: StoredUser[] = stored ? JSON.parse(stored) : [];
        if (users.find(u => u.email === email)) {
          return { success: false, error: 'An account with this email already exists' };
        }
        const newUser: StoredUser = {
          id: crypto.randomUUID(),
          email,
          firstName,
          lastName,
          companyName,
          passwordHash: hashPassword(password),
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        localStorage.setItem('techpac_users', JSON.stringify(users));
        const { passwordHash: _ph, ...user } = newUser;
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;
        const updated = { ...current, ...data };
        set({ user: updated });
        // also update in users list
        const stored = localStorage.getItem('techpac_users');
        const users: StoredUser[] = stored ? JSON.parse(stored) : [];
        const idx = users.findIndex(u => u.id === current.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...data };
          localStorage.setItem('techpac_users', JSON.stringify(users));
        }
      },
    }),
    { name: 'techpac_auth' }
  )
);
