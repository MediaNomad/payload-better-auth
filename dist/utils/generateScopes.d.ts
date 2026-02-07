/**
 * Auto-generate API key scopes from Payload collections.
 */
import type { CollectionConfig } from 'payload';
import type { ScopeDefinition, ApiKeyScopesConfig, AvailableScope } from '../types/apiKey.js';
/**
 * Generate scopes from Payload collections.
 * Creates {collection}:read, {collection}:write, {collection}:delete for each collection.
 */
export declare function generateScopesFromCollections(collections: CollectionConfig[], excludeCollections?: string[]): Record<string, ScopeDefinition>;
/**
 * Build the final scopes configuration from plugin options and collections.
 * Handles merging custom scopes with auto-generated collection scopes.
 */
export declare function buildAvailableScopes(collections: CollectionConfig[], config?: ApiKeyScopesConfig): AvailableScope[];
/**
 * Convert selected scopes to Better Auth permission format.
 * Used when creating an API key.
 */
export declare function scopesToPermissions(selectedScopeIds: string[], availableScopes: AvailableScope[]): Record<string, string[]>;
