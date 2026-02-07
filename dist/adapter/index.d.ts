/**
 * Payload CMS Adapter for Better Auth
 *
 * Uses Better Auth's createAdapterFactory for schema-aware transformations,
 * eliminating hardcoded field mappings and supporting all Better Auth plugins.
 *
 * @packageDocumentation
 */
import type { Adapter, BetterAuthOptions } from 'better-auth';
import type { BasePayload } from 'payload';
export type PayloadAdapterConfig = {
    /**
     * The Payload instance or a function that returns it.
     * Use a function for lazy initialization to avoid circular dependencies.
     */
    payloadClient: BasePayload | (() => Promise<BasePayload>);
    /**
     * Adapter configuration options
     */
    adapterConfig?: {
        /**
         * Enable debug logging for troubleshooting
         */
        enableDebugLogs?: boolean;
        /**
         * ID type used by Payload.
         * If not specified, auto-detects from Better Auth's generateId setting.
         * - 'number' for SERIAL/auto-increment (Payload default)
         * - 'text' for UUID
         */
        idType?: 'number' | 'text';
        /**
         * Additional fields to convert to numeric IDs beyond the *Id heuristic.
         * Use when you have ID fields that don't follow the naming convention.
         * @example ['customOrgRef', 'legacyIdentifier']
         */
        idFieldsAllowlist?: string[];
        /**
         * Fields to exclude from numeric ID conversion.
         * Use when a field ends in 'Id' but isn't actually an ID reference.
         * @example ['visitorId', 'correlationId']
         */
        idFieldsBlocklist?: string[];
    };
};
/**
 * Creates a Better Auth adapter that uses Payload CMS as the database.
 *
 * Uses Better Auth's createAdapterFactory for proper schema-aware transformations,
 * automatically supporting all Better Auth plugins without hardcoded field mappings.
 *
 * @example Basic usage
 * ```ts
 * import { payloadAdapter } from '@delmaredigital/payload-better-auth/adapter'
 *
 * const auth = betterAuth({
 *   database: payloadAdapter({
 *     payloadClient: payload,
 *   }),
 *   // For serial IDs (Payload default), configure Better Auth:
 *   advanced: {
 *     database: {
 *       generateId: 'serial',
 *     },
 *   },
 * })
 * ```
 *
 * @example Custom collection names
 * ```ts
 * const auth = betterAuth({
 *   database: payloadAdapter({ payloadClient: payload }),
 *   // Use BetterAuthOptions to customize collection names.
 *   // Provide SINGULAR names - they get pluralized automatically:
 *   user: { modelName: 'member' },         // → 'members' collection
 *   session: { modelName: 'auth_session' }, // → 'auth_sessions' collection
 * })
 * ```
 */
export declare function payloadAdapter({ payloadClient, adapterConfig, }: PayloadAdapterConfig): (options: BetterAuthOptions) => Adapter;
export type { Adapter, BetterAuthOptions };
