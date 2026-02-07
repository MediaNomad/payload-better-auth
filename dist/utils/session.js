/**
 * Server-side session utilities
 *
 * @packageDocumentation
 */ /**
 * Get the current session from headers.
 *
 * @example
 * ```ts
 * import { headers } from 'next/headers'
 * import { getServerSession } from '@delmare/payload-better-auth'
 *
 * export default async function Page() {
 *   const headersList = await headers()
 *   const session = await getServerSession(payload, headersList)
 *
 *   if (!session) {
 *     redirect('/login')
 *   }
 *
 *   return <div>Hello {session.user.name}</div>
 * }
 * ```
 */ export async function getServerSession(payload, headers) {
    try {
        const payloadWithAuth = payload;
        if (!payloadWithAuth.betterAuth) {
            console.error('[session] Better Auth not initialized');
            return null;
        }
        const session = await payloadWithAuth.betterAuth.api.getSession({
            headers
        });
        return session;
    } catch (error) {
        console.error('[session] Error getting session:', error);
        return null;
    }
}
/**
 * Get the current user from the session.
 *
 * @example
 * ```ts
 * import { headers } from 'next/headers'
 * import { getServerUser } from '@delmare/payload-better-auth'
 *
 * export default async function Page() {
 *   const headersList = await headers()
 *   const user = await getServerUser(payload, headersList)
 *
 *   if (!user) {
 *     redirect('/login')
 *   }
 *
 *   return <div>Hello {user.name}</div>
 * }
 * ```
 */ export async function getServerUser(payload, headers) {
    const session = await getServerSession(payload, headers);
    return session?.user ?? null;
}
