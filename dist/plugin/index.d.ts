/**
 * Payload Plugins for Better Auth
 *
 * @packageDocumentation
 */
import type { Plugin, AuthStrategy, BasePayload } from 'payload';
import type { betterAuth, BetterAuthOptions } from 'better-auth';
import type { ApiKeyScopesConfig } from '../types/apiKey.js';
export type Auth = ReturnType<typeof betterAuth>;
export type { PayloadWithAuth } from '../types/betterAuth.js';
export type CreateAuthFunction = (payload: BasePayload) => Auth;
export type BetterAuthPluginAdminOptions = {
    /** Disable auto-injection of logout button */
    disableLogoutButton?: boolean;
    /** Disable auto-injection of BeforeLogin redirect */
    disableBeforeLogin?: boolean;
    /** Disable auto-injection of login view */
    disableLoginView?: boolean;
    /** Login page customization */
    login?: {
        /** Custom title for login page */
        title?: string;
        /** Path to redirect after successful login. Default: '/admin' */
        afterLoginPath?: string;
        /**
         * Required role(s) for admin access.
         * - string: Single role required (default: 'admin')
         * - string[]: Multiple roles (behavior depends on requireAllRoles)
         * - null: Disable role checking
         */
        requiredRole?: string | string[] | null;
        /**
         * When requiredRole is an array, require ALL roles (true) or ANY role (false).
         * Default: false (any matching role grants access)
         */
        requireAllRoles?: boolean;
        /**
         * Enable passkey (WebAuthn) sign-in option.
         * - true: Always show passkey button
         * - false: Never show passkey button
         * - 'auto': Auto-detect if passkey plugin is available (default for LoginView)
         * Default: false (for backwards compatibility)
         */
        enablePasskey?: boolean | 'auto';
        /**
         * Enable user registration (sign up) option.
         * - true: Always show "Create account" link
         * - false: Never show registration option
         * - 'auto': Auto-detect if sign-up endpoint is available
         * Default: 'auto' - LoginView automatically detects if Better Auth has signup enabled
         */
        enableSignUp?: boolean | 'auto';
        /**
         * Default role to assign to new users during registration.
         * Only used when enableSignUp is enabled.
         * Default: 'user'
         */
        defaultSignUpRole?: string;
        /**
         * Enable forgot password option.
         * - true: Always show "Forgot password?" link
         * - false: Never show forgot password option
         * - 'auto': Auto-detect if password reset endpoint is available
         * Default: 'auto' - LoginView automatically detects if Better Auth has password reset enabled
         */
        enableForgotPassword?: boolean | 'auto';
        /**
         * Custom URL for password reset page. If provided, users will be redirected here
         * instead of showing the inline password reset form.
         */
        resetPasswordUrl?: string;
    };
    /** Path to custom logout button component (import map format) */
    logoutButtonComponent?: string;
    /** Path to custom BeforeLogin component (import map format) */
    beforeLoginComponent?: string;
    /** Path to custom login view component (import map format) */
    loginViewComponent?: string;
    /**
     * Enable management UI for security features (2FA, API keys).
     * Management views are auto-injected based on which Better Auth plugins are enabled.
     * @default true
     */
    enableManagementUI?: boolean;
    /**
     * Better Auth options - used to detect which plugins are enabled.
     * Required for management UI to auto-detect enabled features.
     */
    betterAuthOptions?: Partial<BetterAuthOptions>;
    /** Custom paths for management views */
    managementPaths?: {
        /** Two-factor management view path. Default: '/security/two-factor' */
        twoFactor?: string;
        /** API keys management view path. Default: '/security/api-keys' */
        apiKeys?: string;
        /** Passkeys management view path. Default: '/security/passkeys' */
        passkeys?: string;
    };
    /**
     * API key scopes configuration.
     * Controls which permission scopes are available when creating API keys.
     * When not provided, scopes are auto-generated from Payload collections.
     */
    apiKey?: ApiKeyScopesConfig;
};
export type BetterAuthPluginOptions = {
    /**
     * Function that creates the Better Auth instance.
     * Called during Payload's onInit lifecycle.
     */
    createAuth: CreateAuthFunction;
    /**
     * Base path for auth API endpoints (registered via Payload endpoints).
     * @default '/auth'
     */
    authBasePath?: string;
    /**
     * Auto-register auth API endpoints via Payload's endpoint system.
     * Set to false if you need custom route-level handling (rare).
     * Note: All Better Auth customization (hooks, plugins, callbacks)
     * is done in createAuth - the route handler is just a passthrough.
     * @default true
     */
    autoRegisterEndpoints?: boolean;
    /**
     * Auto-inject admin components when disableLocalStrategy is detected.
     * @default true
     */
    autoInjectAdminComponents?: boolean;
    /**
     * Admin UI customization options.
     */
    admin?: BetterAuthPluginAdminOptions;
};
/**
 * Get the configured API key scopes config.
 * Used by the ApiKeysView to build available scopes.
 */
export declare function getApiKeyScopesConfig(): ApiKeyScopesConfig | undefined;
/**
 * Payload plugin that initializes Better Auth.
 *
 * Better Auth is created in onInit (after Payload is ready) to avoid
 * circular dependency issues. The auth instance is then attached to
 * payload.betterAuth for access throughout the app.
 *
 * Features:
 * - Auto-registers auth API endpoints (configurable)
 * - Auto-injects admin components when disableLocalStrategy is detected
 * - Auto-injects management UI for security features based on enabled plugins
 * - Handles HMR gracefully
 *
 * @example
 * ```ts
 * import { createBetterAuthPlugin } from '@delmaredigital/payload-better-auth/plugin'
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
export declare function createBetterAuthPlugin(options: BetterAuthPluginOptions): Plugin;
export type BetterAuthStrategyOptions = {
    /**
     * The collection slug for users
     * @default 'users'
     */
    usersCollection?: string;
    /**
     * The collection slug for organization members (used for organization role lookup)
     * @default 'members'
     */
    membersCollection?: string;
};
/**
 * Payload auth strategy that uses Better Auth for authentication.
 *
 * Use this in your Users collection to authenticate via Better Auth sessions.
 *
 * Session fields (like `activeOrganizationId` from the organization plugin) are
 * automatically merged onto `req.user`, making them available in access control functions.
 *
 * If an active organization is set, the user's role in that organization is also
 * fetched and available as `req.user.organizationRole`.
 *
 * @example
 * ```ts
 * import { betterAuthStrategy } from '@delmaredigital/payload-better-auth/plugin'
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
 *
 * @example Access control with organization data
 * ```ts
 * // In your access control:
 * export const orgReadAccess: Access = ({ req }) => {
 *   if (!req.user?.activeOrganizationId) return false
 *   return {
 *     organization: { equals: req.user.activeOrganizationId }
 *   }
 * }
 * ```
 */
export declare function betterAuthStrategy(options?: BetterAuthStrategyOptions): AuthStrategy;
/**
 * Reset the auth instance (useful for testing)
 */
export declare function resetAuthInstance(): void;
