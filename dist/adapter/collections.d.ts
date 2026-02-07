/**
 * Auto-generate Payload collections from Better Auth schema
 *
 * @packageDocumentation
 */
import type { CollectionConfig, Plugin } from 'payload';
import type { BetterAuthOptions } from 'better-auth';
import type { FirstUserAdminOptions } from '../utils/firstUserAdmin.js';
export type { FirstUserAdminOptions };
export type BetterAuthCollectionsOptions = {
    /**
     * Better Auth options. Pass the same options you use for betterAuth().
     * The plugin reads the schema to generate collections.
     */
    betterAuthOptions?: BetterAuthOptions;
    /**
     * Collections to skip (they already exist in your config)
     * Default: ['user'] - assumes you have a Users collection
     */
    skipCollections?: string[];
    /**
     * Admin group name for generated collections
     * Default: 'Auth'
     */
    adminGroup?: string;
    /**
     * Custom access control for generated collections.
     * By default, only admins can read/delete, and create/update are disabled.
     */
    access?: CollectionConfig['access'];
    /**
     * Whether to pluralize collection slugs (add 's' suffix).
     * Should match your adapter's usePlural setting.
     * Default: true (matches Payload conventions)
     */
    usePlural?: boolean;
    /**
     * Configure saveToJWT for session-related fields.
     * This controls which fields are included in JWT tokens.
     * Default: true
     */
    configureSaveToJWT?: boolean;
    /**
     * Automatically make the first registered user an admin.
     * Enabled by default. Set to `false` to disable, or provide options to customize.
     *
     * @default true
     *
     * @example Disable
     * ```ts
     * betterAuthCollections({
     *   betterAuthOptions: authOptions,
     *   firstUserAdmin: false,
     * })
     * ```
     *
     * @example Custom roles
     * ```ts
     * betterAuthCollections({
     *   betterAuthOptions: authOptions,
     *   firstUserAdmin: {
     *     adminRole: 'super-admin',
     *     defaultRole: 'member',
     *   },
     * })
     * ```
     */
    firstUserAdmin?: boolean | FirstUserAdminOptions;
    /**
     * Customize a generated collection before it's added to config.
     * Use this to add hooks, modify fields, or adjust any collection setting.
     *
     * @example
     * ```ts
     * customizeCollection: (modelKey, collection) => {
     *   if (modelKey === 'session') {
     *     return {
     *       ...collection,
     *       hooks: {
     *         afterDelete: [myCleanupHook],
     *       },
     *     }
     *   }
     *   return collection
     * }
     * ```
     */
    customizeCollection?: (modelKey: string, collection: CollectionConfig) => CollectionConfig;
};
/**
 * Payload plugin that auto-generates collections from Better Auth schema.
 *
 * @example Basic usage
 * ```ts
 * import { betterAuthCollections } from '@delmaredigital/payload-better-auth'
 *
 * export default buildConfig({
 *   plugins: [
 *     betterAuthCollections({
 *       betterAuthOptions: { ... },
 *       skipCollections: ['user'], // Define Users yourself
 *     }),
 *   ],
 * })
 * ```
 *
 * @example With customization callback
 * ```ts
 * betterAuthCollections({
 *   betterAuthOptions: authOptions,
 *   customizeCollection: (modelKey, collection) => {
 *     if (modelKey === 'session') {
 *       return {
 *         ...collection,
 *         hooks: { afterDelete: [cleanupHook] },
 *       }
 *     }
 *     return collection
 *   },
 * })
 * ```
 */
export declare function betterAuthCollections(options?: BetterAuthCollectionsOptions): Plugin;
