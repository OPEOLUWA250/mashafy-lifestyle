import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  adminUser: { email: string; loginTime: number } | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  validateSession: () => { isValid: boolean; reason?: string };
  updateActivity: () => void;
  failedAttempts: number;
  lockoutTime: number | null;
}

// Security constants
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: import.meta.env.VITE_ADMIN_EMAIL || "admin@mashafy.com",
  password: import.meta.env.VITE_ADMIN_PASSWORD || "password123",
};

// In-memory tracking (persists during session)
let failedAttemptCount = 0;
let lastActivity = Date.now();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminUser: null,
      failedAttempts: 0,
      lockoutTime: null,

      login: async (email: string, password: string) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const now = Date.now();

            // Check if account is locked
            if (get().lockoutTime && now < get().lockoutTime!) {
              const remainingMinutes = Math.ceil(
                (get().lockoutTime! - now) / 1000 / 60,
              );
              resolve({
                success: false,
                error: `Too many failed attempts. Try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}.`,
              });
              return;
            }

            // Reset failed attempts if lockout expired
            if (get().lockoutTime && now >= get().lockoutTime!) {
              failedAttemptCount = 0;
              set({ failedAttempts: 0, lockoutTime: null });
            }

            // Validate credentials
            if (
              email === ADMIN_CREDENTIALS.email &&
              password === ADMIN_CREDENTIALS.password
            ) {
              // Reset failed attempts on successful login
              failedAttemptCount = 0;
              lastActivity = now;

              set({
                isAuthenticated: true,
                adminUser: {
                  email,
                  loginTime: now,
                },
                failedAttempts: 0,
                lockoutTime: null,
              });
              resolve({ success: true });
            } else {
              // Increment failed attempts
              failedAttemptCount++;

              const remainingAttempts =
                MAX_FAILED_ATTEMPTS - failedAttemptCount;

              // Lock account if max attempts exceeded
              if (failedAttemptCount >= MAX_FAILED_ATTEMPTS) {
                const lockoutEndTime = now + LOCKOUT_DURATION;
                set({
                  failedAttempts: failedAttemptCount,
                  lockoutTime: lockoutEndTime,
                });
                resolve({
                  success: false,
                  error: `Account locked due to too many failed attempts. Try again later.`,
                });
              } else {
                set({ failedAttempts: failedAttemptCount });
                resolve({
                  success: false,
                  error: `Invalid email or password. (${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} remaining)`,
                });
              }
            }
          }, 500);
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          adminUser: null,
        });
        lastActivity = 0;
      },

      validateSession: () => {
        const state = get();
        const now = Date.now();

        if (!state.isAuthenticated || !state.adminUser) {
          return { isValid: false, reason: "Not authenticated" };
        }

        // Check session timeout
        const timeSinceLastActivity = now - lastActivity;
        if (timeSinceLastActivity > SESSION_TIMEOUT) {
          set({ isAuthenticated: false, adminUser: null });
          return {
            isValid: false,
            reason: "Session expired due to inactivity",
          };
        }

        return { isValid: true };
      },

      updateActivity: () => {
        lastActivity = Date.now();
      },
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        adminUser: state.adminUser,
        failedAttempts: state.failedAttempts,
        lockoutTime: state.lockoutTime,
      }),
    },
  ),
);
