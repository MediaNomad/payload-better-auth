/**
 * API Key Scope Enforcement Utilities
 *
 * These utilities help enforce API key scopes in Payload access control.
 * They extract the API key from requests, validate scopes, and provide
 * type-safe access control functions.
 *
 * @example
 * ```ts
 * import { requireScope, requireAnyScope } from '@delmaredigital/payload-better-auth'
 *
 * export const Posts: CollectionConfig = {
 *   slug: 'posts',
 *   access: {
 *     read: requireAnyScope(['posts:read', 'content:read']),
 *     create: requireScope('posts:write'),
 *     update: requireScope('posts:write'),
 *     delete: requireScope('posts:delete'),
 *   },
 * }
 * ```
 */
import type { Access, PayloadRequest } from 'payload';
export type ApiKeyInfo = {
    /** The API key ID */
    id: string;
    /** User ID who owns this key */
    userId: string;
    /** Array of granted scope strings */
    scopes: string[];
    /** The raw key (only first/last chars visible) */
    keyPrefix?: string;
    /** Optional metadata */
    metadata?: Record<string, unknown>;
};
export type ApiKeyAccessConfig = {
    /**
     * API keys collection slug.
     * @default 'apiKeys' or 'api-keys' (auto-detected)
     */
    apiKeysCollection?: string;
    /**
     * Allow access if user is authenticated (non-API key session).
     * Useful for allowing both API keys and regular sessions.
     * @default false
     */
    allowAuthenticatedUsers?: boolean;
    /**
     * Custom function to extract API key from request.
     * By default, extracts from Authorization: Bearer <key> header.
     */
    extractApiKey?: (req: PayloadRequest) => string | null;
};
/**
 * Extract API key from request headers.
 * Supports Bearer token format: Authorization: Bearer <api-key>
 */
export declare function extractApiKeyFromRequest(req: PayloadRequest): string | null;
/**
 * Look up API key info from the database.
 * Returns null if key not found or disabled.
 */
export declare function getApiKeyInfo(req: PayloadRequest, apiKey: string, apiKeysCollection?: string): Promise<ApiKeyInfo | null>;
/**
 * Check if an API key has a specific scope.
 * Supports wildcard patterns like 'posts:*' matching 'posts:read', 'posts:write', etc.
 */
export declare function hasScope(keyScopes: string[], requiredScope: string): boolean;
/**
 * Check if an API key has any of the specified scopes.
 */
export declare function hasAnyScope(keyScopes: string[], requiredScopes: string[]): boolean;
/**
 * Check if an API key has all of the specified scopes.
 */
export declare function hasAllScopes(keyScopes: string[], requiredScopes: string[]): boolean;
/**
 * Create an access control function that requires a specific scope.
 *
 * @param scope - The required scope string (e.g., 'posts:read')
 * @param config - Configuration options
 * @returns Payload access function
 *
 * @example
 * ```ts
 * access: {
 *   read: requireScope('posts:read'),
 *   create: requireScope('posts:write'),
 * }
 * ```
 */
export declare function requireScope(scope: string, config?: ApiKeyAccessConfig): Access;
/**
 * Create an access control function that requires any of the specified scopes.
 *
 * @param scopes - Array of acceptable scopes (at least one must match)
 * @param config - Configuration options
 * @returns Payload access function
 *
 * @example
 * ```ts
 * access: {
 *   read: requireAnyScope(['posts:read', 'content:read', 'admin:*']),
 * }
 * ```
 */
export declare function requireAnyScope(scopes: string[], config?: ApiKeyAccessConfig): Access;
/**
 * Create an access control function that requires all specified scopes.
 *
 * @param scopes - Array of required scopes (all must be present)
 * @param config - Configuration options
 * @returns Payload access function
 *
 * @example
 * ```ts
 * access: {
 *   delete: requireAllScopes(['posts:delete', 'admin:write']),
 * }
 * ```
 */
export declare function requireAllScopes(scopes: string[], config?: ApiKeyAccessConfig): Access;
/**
 * Create an access control function that allows either:
 * 1. Authenticated users (via session)
 * 2. API key with required scope
 *
 * This is useful for endpoints that should work with both auth methods.
 *
 * @param scope - The required scope for API key access
 * @param config - Configuration options
 * @returns Payload access function
 *
 * @example
 * ```ts
 * access: {
 *   read: allowSessionOrScope('posts:read'),
 * }
 * ```
 */
export declare function allowSessionOrScope(scope: string, config?: Omit<ApiKeyAccessConfig, 'allowAuthenticatedUsers'>): Access;
/**
 * Create an access control function that allows either:
 * 1. Authenticated users (via session)
 * 2. API key with any of the required scopes
 *
 * @param scopes - Array of acceptable scopes for API key access
 * @param config - Configuration options
 * @returns Payload access function
 */
export declare function allowSessionOrAnyScope(scopes: string[], config?: Omit<ApiKeyAccessConfig, 'allowAuthenticatedUsers'>): Access;
/**
 * Validate an API key and get its info.
 *
 * This performs a database lookup to validate the key and retrieve
 * its associated scopes and user.
 *
 * @param req - Payload request
 * @param apiKeysCollection - The API keys collection slug
 * @returns API key info if valid, null otherwise
 *
 * @example
 * ```ts
 * const keyInfo = await validateApiKey(req)
 * if (keyInfo) {
 *   console.log('Valid API key for user:', keyInfo.userId)
 *   console.log('Scopes:', keyInfo.scopes)
 * }
 * ```
 */
export declare function validateApiKey(req: PayloadRequest, apiKeysCollection?: string): Promise<ApiKeyInfo | null>;
