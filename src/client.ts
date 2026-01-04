/**
 * Client-side auth utilities
 *
 * Re-exports from better-auth/react for convenience.
 * Configure your own auth client in your app.
 *
 * @packageDocumentation
 */

'use client'

export { createAuthClient } from 'better-auth/react'

/**
 * Create a configured auth client for your app.
 *
 * @example
 * ```ts
 * // src/lib/auth/client.ts
 * 'use client'
 *
 * import { createAuthClient } from '@delmare/payload-better-auth/client'
 *
 * const getBaseURL = () => {
 *   if (typeof window !== 'undefined') {
 *     return window.location.origin
 *   }
 *   return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
 * }
 *
 * export const authClient = createAuthClient({
 *   baseURL: getBaseURL(),
 * })
 *
 * export const { useSession, signIn, signUp, signOut } = authClient
 * ```
 */
