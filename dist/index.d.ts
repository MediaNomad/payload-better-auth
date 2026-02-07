/**
 * @delmare/payload-better-auth
 *
 * Better Auth adapter and plugins for Payload CMS.
 * Enables seamless integration between Better Auth and Payload.
 *
 * @packageDocumentation
 */
export { payloadAdapter } from './adapter/index.js';
export type { PayloadAdapterConfig } from './adapter/index.js';
export { betterAuthCollections } from './adapter/collections.js';
export type { BetterAuthCollectionsOptions } from './adapter/collections.js';
export { createBetterAuthPlugin, betterAuthStrategy, resetAuthInstance, getApiKeyScopesConfig, } from './plugin/index.js';
export type { Auth, CreateAuthFunction, BetterAuthPluginOptions, BetterAuthPluginAdminOptions, BetterAuthStrategyOptions, } from './plugin/index.js';
export type { BetterAuthReturn, PayloadWithAuth, PayloadRequestWithBetterAuth, CollectionHookWithBetterAuth, EndpointWithBetterAuth, RoleArray, } from './types/betterAuth.js';
export type { User, Session as BetterAuthSession, Account, Verification, Apikey, Passkey, Organization, Member, Invitation, Team, TeamMember, TwoFactor, BaseUserFields, BaseSessionFields, BaseAccountFields, UserPluginFields, SessionPluginFields, BetterAuthFullSchema, ModelKey, PluginId, } from './generated-types.js';
export type { ScopeDefinition, ApiKeyScopesConfig, AvailableScope, } from './types/apiKey.js';
export { generateScopesFromCollections, buildAvailableScopes, scopesToPermissions, } from './utils/generateScopes.js';
export { normalizeRoles, hasAnyRole, hasAllRoles, hasAdminRoles, isAdmin, isAdminField, isAdminOrSelf, canUpdateOwnFields, isAuthenticated, isAuthenticatedField, hasRole, hasRoleField, requireAllRoles, } from './utils/access.js';
export type { RoleCheckConfig, SelfAccessConfig, FieldUpdateConfig, } from './utils/access.js';
export { extractApiKeyFromRequest, getApiKeyInfo, hasScope, hasAnyScope as hasAnyScopeKey, hasAllScopes as hasAllScopesKey, requireScope, requireAnyScope, requireAllScopes as requireAllScopesKey, allowSessionOrScope, allowSessionOrAnyScope, validateApiKey, } from './utils/apiKeyAccess.js';
export type { ApiKeyInfo, ApiKeyAccessConfig, } from './utils/apiKeyAccess.js';
export { detectAuthConfig } from './utils/detectAuthConfig.js';
export type { AuthDetectionResult } from './utils/detectAuthConfig.js';
export { getServerSession, getServerUser } from './utils/session.js';
export type { Session } from './utils/session.js';
export { firstUserAdminHooks } from './utils/firstUserAdmin.js';
export type { FirstUserAdminOptions } from './utils/firstUserAdmin.js';
export { withBetterAuthDefaults, apiKeyWithDefaults } from './utils/betterAuthDefaults.js';
