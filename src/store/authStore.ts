import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  verifyPassword,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  logAdminAction,
  generateSessionToken,
  signSessionToken,
  getStoredCredentials,
  storeCredentialsSecurely,
  initializeSecureCredentials,
} from "../utils/secureAuth";

interface AuthState {
  isAuthenticated: boolean;
  sessionToken: string | null;
  adminUser: { email: string; loginTime: number } | null;
  lastActivity: number;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  validateSession: () => { isValid: boolean; reason?: string };
  updateActivity: () => void;
}

// Security constants
const MAX_FAILED_ATTEMPTS = 5;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity

// Initialize secure credentials on first run
const initializeCredentials = async () => {
  const existing = getStoredCredentials();
  if (!existing) {
    const creds = await initializeSecureCredentials();
    storeCredentialsSecurely(creds);
    console.log("🔐 Secure credentials initialized");
  }
};

initializeCredentials();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      sessionToken: null,
      adminUser: null,
      lastActivity: 0,

      login: async (email: string, password: string) => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            try {
              const now = Date.now();

              // Check rate limiting from localStorage
              const rateCheck = checkRateLimit(MAX_FAILED_ATTEMPTS);
              if (!rateCheck.allowed) {
                logAdminAction("login_attempt", { email }, "failure");
                resolve({
                  success: false,
                  error: rateCheck.reason || "Too many attempts",
                });
                return;
              }

              // Get stored credentials (hashed)
              const stored = getStoredCredentials();
              if (!stored) {
                logAdminAction("login_attempt", { email }, "failure");
                resolve({
                  success: false,
                  error: "Authentication system not initialized",
                });
                return;
              }

              // Verify email and password
              if (email !== stored.email) {
                recordFailedAttempt(MAX_FAILED_ATTEMPTS);
                logAdminAction("login_attempt", { email, reason: "invalid_email" }, "failure");
                resolve({
                  success: false,
                  error: `Invalid credentials. (${(rateCheck.remainingAttempts || 0) - 1} attempts remaining)`,
                });
                return;
              }

              // Verify password hash
              const passwordValid = await verifyPassword(password, stored.salt, stored.passwordHash);
              if (!passwordValid) {
                recordFailedAttempt(MAX_FAILED_ATTEMPTS);
                logAdminAction("login_attempt", { email, reason: "invalid_password" }, "failure");
                resolve({
                  success: false,
                  error: `Invalid credentials. (${(rateCheck.remainingAttempts || 0) - 1} attempts remaining)`,
                });
                return;
              }

              // Successful login - generate session token
              resetRateLimit();
              const token = generateSessionToken();
              const signedToken = await signSessionToken(token, stored.salt);

              logAdminAction("login_success", { email }, "success");

              set({
                isAuthenticated: true,
                sessionToken: signedToken,
                adminUser: {
                  email,
                  loginTime: now,
                },
                lastActivity: now,
              });

              resolve({ success: true });
            } catch (error) {
              console.error("Login error:", error);
              logAdminAction("login_attempt", { email, error: String(error) }, "failure");
              resolve({
                success: false,
                error: "An error occurred during login",
              });
            }
          }, 500);
        });
      },

      logout: () => {
        const adminUser = get().adminUser;
        if (adminUser) {
          logAdminAction("logout", { email: adminUser.email }, "success");
        }
        set({
          isAuthenticated: false,
          sessionToken: null,
          adminUser: null,
          lastActivity: 0,
        });
      },

      validateSession: () => {
        const state = get();
        const now = Date.now();

        if (!state.isAuthenticated || !state.adminUser || !state.sessionToken) {
          return { isValid: false, reason: "Not authenticated" };
        }

        // Check session timeout
        const timeSinceLastActivity = now - state.lastActivity;
        if (timeSinceLastActivity > SESSION_TIMEOUT) {
          logAdminAction("session_timeout", { email: state.adminUser.email }, "success");
          set({ isAuthenticated: false, sessionToken: null, adminUser: null, lastActivity: 0 });
          return {
            isValid: false,
            reason: "Session expired due to inactivity",
          };
        }

        return { isValid: true };
      },

      updateActivity: () => {
        set({ lastActivity: Date.now() });
      },
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        sessionToken: state.sessionToken,
        adminUser: state.adminUser,
        lastActivity: state.lastActivity,
      }),
    },
  ),
);
