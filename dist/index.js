/**
 * @delmare/payload-better-auth
 *
 * Better Auth adapter and plugins for Payload CMS.
 * Enables seamless integration between Better Auth and Payload.
 *
 * @packageDocumentation
 */ // Adapter
export { payloadAdapter } from './adapter/index.js';
// Collection generator plugin
export { betterAuthCollections } from './adapter/collections.js';
// Payload plugin and strategy
export { createBetterAuthPlugin, betterAuthStrategy, resetAuthInstance, getApiKeyScopesConfig } from './plugin/index.js';
// Scope utilities
export { generateScopesFromCollections, buildAvailableScopes, scopesToPermissions } from './utils/generateScopes.js';
// Access control utilities
export { normalizeRoles, hasAnyRole, hasAllRoles, hasAdminRoles, isAdmin, isAdminField, isAdminOrSelf, canUpdateOwnFields, isAuthenticated, isAuthenticatedField, hasRole, hasRoleField, requireAllRoles } from './utils/access.js';
// API key scope enforcement utilities
export { extractApiKeyFromRequest, getApiKeyInfo, hasScope, hasAnyScope as hasAnyScopeKey, hasAllScopes as hasAllScopesKey, requireScope, requireAnyScope, requireAllScopes as requireAllScopesKey, allowSessionOrScope, allowSessionOrAnyScope, validateApiKey } from './utils/apiKeyAccess.js';
// Auth config detection utility
export { detectAuthConfig } from './utils/detectAuthConfig.js';
// Session utilities
export { getServerSession, getServerUser } from './utils/session.js';
// First user admin hook utility
export { firstUserAdminHooks } from './utils/firstUserAdmin.js';
// Better Auth defaults utility
export { withBetterAuthDefaults, apiKeyWithDefaults } from './utils/betterAuthDefaults.js';
