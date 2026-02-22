import * as z from 'zod';

/**
 * Validates required environment variables at app startup.
 * If any are missing or invalid, this will throw a clear error immediately
 * rather than failing silently at runtime.
 *
 * Import this module early (e.g. in root.tsx) to catch misconfigurations on boot.
 */
const envSchema = z.object({
    VITE_API_URL: z.string().url(),
    VITE_OAUTH_CLIENT_ID: z.string().min(1),
    VITE_OAUTH_CLIENT_SECRET: z.string().min(1),
});

export const env = envSchema.parse(import.meta.env);
