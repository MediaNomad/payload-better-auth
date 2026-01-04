/**
 * @delmare/payload-better-auth
 *
 * Better Auth adapter and plugins for Payload CMS.
 * Enables seamless integration between Better Auth and Payload.
 *
 * @packageDocumentation
 */

// Adapter
export { payloadAdapter } from './adapter'
export type { PayloadAdapterConfig } from './adapter'

// Collection generator plugin
export { betterAuthCollections } from './adapter/collections'
export type { BetterAuthCollectionsOptions } from './adapter/collections'

// Payload plugin and strategy
export {
  createBetterAuthPlugin,
  betterAuthStrategy,
  resetAuthInstance,
} from './plugin'
export type {
  Auth,
  PayloadWithAuth,
  CreateAuthFunction,
  BetterAuthPluginOptions,
  BetterAuthStrategyOptions,
} from './plugin'

// Session utilities
export { getServerSession, getServerUser } from './utils/session'
export type { Session } from './utils/session'
