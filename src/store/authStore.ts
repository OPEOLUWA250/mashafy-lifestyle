import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../utils/supabase";

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
  initializeSession: () => Promise<void>;
}

// Security constants
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity

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
        const now = Date.now();

        // Check if account is locked
        if (get().lockoutTime && now < get().lockoutTime!) {
          const remainingMinutes = Math.ceil(
            (get().lockoutTime! - now) / 1000 / 60,
          );
          return {
            success: false,
            error: `Too many failed attempts. Try again in ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}.`,
          };
        }

        // Reset failed attempts if lockout expired
        if (get().lockoutTime && now >= get().lockoutTime!) {
          failedAttemptCount = 0;
          set({ failedAttempts: 0, lockoutTime: null });
        }

        // Authenticate with Supabase
        if (!supabase) {
          return {
            success: false,
            error:
              "Authentication service not available. Please check your Supabase configuration.",
          };
        }

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error || !data.user) {
            console.error("Login error:", error?.message || "Unknown error");

            // Increment failed attempts
            failedAttemptCount++;
            const remainingAttempts = MAX_FAILED_ATTEMPTS - failedAttemptCount;

            // Lock account if max attempts exceeded
            if (failedAttemptCount >= MAX_FAILED_ATTEMPTS) {
              const lockoutEndTime = now + LOCKOUT_DURATION;
              set({
                failedAttempts: failedAttemptCount,
                lockoutTime: lockoutEndTime,
              });
              return {
                success: false,
                error: `Account locked due to too many failed attempts. Try again later.`,
              };
            } else {
              set({ failedAttempts: failedAttemptCount });
              return {
                success: false,
                error:
                  error?.message ||
                  `Invalid email or password. (${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} remaining)`,
              };
            }
          }

          // Successful login
          failedAttemptCount = 0;
          lastActivity = now;

          set({
            isAuthenticated: true,
            adminUser: {
              email: data.user.email || "",
              loginTime: now,
            },
            failedAttempts: 0,
            lockoutTime: null,
          });

          return { success: true };
        } catch (err: any) {
          console.error("Unexpected login error:", err);
          return {
            success: false,
            error: err?.message || "An unexpected error occurred during login",
          };
        }
      },

      logout: () => {
        if (supabase) {
          supabase.auth.signOut().catch(console.error);
        }
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

      initializeSession: async () => {
        if (!supabase) return;

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          failedAttemptCount = 0;
          lastActivity = Date.now();
          set({
            isAuthenticated: true,
            adminUser: {
              email: session.user.email || "",
              loginTime: Date.now(),
            },
            failedAttempts: 0,
            lockoutTime: null,
          });
        }
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
