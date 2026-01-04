/**
 * Payload Plugins for Better Auth
 *
 * @packageDocumentation
 */

import type { Plugin, AuthStrategy, Payload, BasePayload } from 'payload'
import type { betterAuth } from 'better-auth'

export type Auth = ReturnType<typeof betterAuth>
export type PayloadWithAuth = BasePayload & { betterAuth: Auth }

export type CreateAuthFunction = (payload: BasePayload) => Auth

export type BetterAuthPluginOptions = {
  /**
   * Function that creates the Better Auth instance.
   * Called during Payload's onInit lifecycle.
   */
  createAuth: CreateAuthFunction
}

// Track auth instance for HMR
let authInstance: Auth | null = null

/**
 * Payload plugin that initializes Better Auth.
 *
 * Better Auth is created in onInit (after Payload is ready) to avoid
 * circular dependency issues. The auth instance is then attached to
 * payload.betterAuth for access throughout the app.
 *
 * @example
 * ```ts
 * import { createBetterAuthPlugin } from '@delmare/payload-better-auth/plugin'
 *
 * export default buildConfig({
 *   plugins: [
 *     createBetterAuthPlugin({
 *       createAuth: (payload) => betterAuth({
 *         database: payloadAdapter({ payloadClient: payload, ... }),
 *         // ... other options
 *       }),
 *     }),
 *   ],
 * })
 * ```
 */
export function createBetterAuthPlugin(
  options: BetterAuthPluginOptions
): Plugin {
  const { createAuth } = options

  return (incomingConfig) => {
    const existingOnInit = incomingConfig.onInit

    return {
      ...incomingConfig,
      onInit: async (payload) => {
        if (existingOnInit) {
          await existingOnInit(payload)
        }

        // Check if already attached (HMR scenario)
        if ('betterAuth' in payload) {
          return
        }

        // Reuse or create auth instance
        if (!authInstance) {
          try {
            authInstance = createAuth(payload)
          } catch (error) {
            console.error('[better-auth] Failed to create auth:', error)
            throw error
          }
        }

        // Attach to payload for global access
        Object.defineProperty(payload, 'betterAuth', {
          value: authInstance,
          writable: false,
          enumerable: false,
          configurable: false,
        })
      },
    }
  }
}

export type BetterAuthStrategyOptions = {
  /**
   * The collection slug for users
   * Default: 'users'
   */
  usersCollection?: string
}

/**
 * Payload auth strategy that uses Better Auth for authentication.
 *
 * Use this in your Users collection to authenticate via Better Auth sessions.
 *
 * @example
 * ```ts
 * import { betterAuthStrategy } from '@delmare/payload-better-auth/plugin'
 *
 * export const Users: CollectionConfig = {
 *   slug: 'users',
 *   auth: {
 *     disableLocalStrategy: true,
 *     strategies: [betterAuthStrategy()],
 *   },
 *   // ...
 * }
 * ```
 */
export function betterAuthStrategy(
  options: BetterAuthStrategyOptions = {}
): AuthStrategy {
  const { usersCollection = 'users' } = options

  return {
    name: 'better-auth',
    authenticate: async ({
      payload,
      headers,
    }: {
      payload: Payload
      headers: Headers
    }) => {
      try {
        const payloadWithAuth = payload as PayloadWithAuth
        const auth = payloadWithAuth.betterAuth

        if (!auth) {
          console.error('Better Auth not initialized on payload instance')
          return { user: null }
        }

        const session = await auth.api.getSession({ headers })

        if (!session?.user?.id) {
          return { user: null }
        }

        const users = await payload.find({
          collection: usersCollection,
          where: { id: { equals: session.user.id } },
          limit: 1,
          depth: 0,
        })

        if (users.docs.length === 0) {
          return { user: null }
        }

        return {
          user: {
            ...users.docs[0],
            collection: usersCollection,
            _strategy: 'better-auth',
          },
        }
      } catch (error) {
        console.error('Better Auth strategy error:', error)
        return { user: null }
      }
    },
  }
}

/**
 * Reset the auth instance (useful for testing)
 */
export function resetAuthInstance(): void {
  authInstance = null
}
