/**
 * Utility to apply sensible defaults to Better Auth options.
 *
 * @packageDocumentation
 */
import type { BetterAuthOptions } from 'better-auth';
import { apiKey as betterAuthApiKey } from 'better-auth/plugins';
type ApiKeyPluginOptions = Parameters<typeof betterAuthApiKey>[0];
/**
 * API Key plugin with sensible defaults for use with this package.
 *
 * Enables metadata storage by default so that scopes can be displayed
 * in the admin UI after key creation.
 *
 * @example
 * ```ts
 * import { apiKeyWithDefaults } from '@delmaredigital/payload-better-auth'
 *
 * export const betterAuthOptions = {
 *   plugins: [
 *     apiKeyWithDefaults(),  // metadata enabled by default
 *   ],
 * }
 * ```
 *
 * @example With custom options
 * ```ts
 * apiKeyWithDefaults({
 *   rateLimit: { max: 100, window: 60 },
 *   // enableMetadata is already true
 * })
 * ```
 */
export declare function apiKeyWithDefaults(options?: ApiKeyPluginOptions): {
    id: "api-key";
    $ERROR_CODES: {
        readonly INVALID_METADATA_TYPE: "metadata must be an object or undefined";
        readonly REFILL_AMOUNT_AND_INTERVAL_REQUIRED: "refillAmount is required when refillInterval is provided";
        readonly REFILL_INTERVAL_AND_AMOUNT_REQUIRED: "refillInterval is required when refillAmount is provided";
        readonly USER_BANNED: "User is banned";
        readonly UNAUTHORIZED_SESSION: "Unauthorized or invalid session";
        readonly KEY_NOT_FOUND: "API Key not found";
        readonly KEY_DISABLED: "API Key is disabled";
        readonly KEY_EXPIRED: "API Key has expired";
        readonly USAGE_EXCEEDED: "API Key has reached its usage limit";
        readonly KEY_NOT_RECOVERABLE: "API Key is not recoverable";
        readonly EXPIRES_IN_IS_TOO_SMALL: "The expiresIn is smaller than the predefined minimum value.";
        readonly EXPIRES_IN_IS_TOO_LARGE: "The expiresIn is larger than the predefined maximum value.";
        readonly INVALID_REMAINING: "The remaining count is either too large or too small.";
        readonly INVALID_PREFIX_LENGTH: "The prefix length is either too large or too small.";
        readonly INVALID_NAME_LENGTH: "The name length is either too large or too small.";
        readonly METADATA_DISABLED: "Metadata is disabled.";
        readonly RATE_LIMIT_EXCEEDED: "Rate limit exceeded.";
        readonly NO_VALUES_TO_UPDATE: "No values to update.";
        readonly KEY_DISABLED_EXPIRATION: "Custom key expiration values are disabled.";
        readonly INVALID_API_KEY: "Invalid API key.";
        readonly INVALID_USER_ID_FROM_API_KEY: "The user id from the API key is invalid.";
        readonly INVALID_API_KEY_GETTER_RETURN_TYPE: "API Key getter returned an invalid key type. Expected string.";
        readonly SERVER_ONLY_PROPERTY: "The property you're trying to set can only be set from the server auth instance only.";
        readonly FAILED_TO_UPDATE_API_KEY: "Failed to update API key";
        readonly NAME_REQUIRED: "API Key name is required.";
    };
    hooks: {
        before: {
            matcher: (ctx: import("better-auth").HookEndpointContext) => boolean;
            handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                };
                session: {
                    id: string;
                    token: string;
                    userId: string;
                    userAgent: string | null;
                    ipAddress: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    expiresAt: Date;
                };
            } | {
                context: import("better-auth").MiddlewareContext<import("better-auth").MiddlewareOptions, {
                    returned?: unknown | undefined;
                    responseHeaders?: Headers | undefined;
                } & import("better-auth").PluginContext & import("better-auth").InfoContext & {
                    options: BetterAuthOptions;
                    trustedOrigins: string[];
                    isTrustedOrigin: (url: string, settings?: {
                        allowRelativePaths: boolean;
                    }) => boolean;
                    oauthConfig: {
                        skipStateCookieCheck?: boolean | undefined;
                        storeStateStrategy: "database" | "cookie";
                    };
                    newSession: {
                        session: import("better-auth").Session & Record<string, any>;
                        user: import("better-auth").User & Record<string, any>;
                    } | null;
                    session: {
                        session: import("better-auth").Session & Record<string, any>;
                        user: import("better-auth").User & Record<string, any>;
                    } | null;
                    setNewSession: (session: {
                        session: import("better-auth").Session & Record<string, any>;
                        user: import("better-auth").User & Record<string, any>;
                    } | null) => void;
                    socialProviders: import("better-auth").OAuthProvider[];
                    authCookies: import("better-auth").BetterAuthCookies;
                    logger: ReturnType<(options?: import("better-auth").Logger | undefined) => import("better-auth").InternalLogger>;
                    rateLimit: {
                        enabled: boolean;
                        window: number;
                        max: number;
                        storage: "memory" | "database" | "secondary-storage";
                    } & Omit<import("better-auth").BetterAuthRateLimitOptions, "enabled" | "window" | "max" | "storage">;
                    adapter: import("better-auth").DBAdapter<BetterAuthOptions>;
                    internalAdapter: import("better-auth").InternalAdapter<BetterAuthOptions>;
                    createAuthCookie: (cookieName: string, overrideAttributes?: Partial<import("better-auth").CookieOptions> | undefined) => import("better-auth").BetterAuthCookie;
                    secret: string;
                    sessionConfig: {
                        updateAge: number;
                        expiresIn: number;
                        freshAge: number;
                        cookieRefreshCache: false | {
                            enabled: true;
                            updateAge: number;
                        };
                    };
                    generateId: (options: {
                        model: import("better-auth").ModelNames;
                        size?: number | undefined;
                    }) => string | false;
                    secondaryStorage: import("better-auth").SecondaryStorage | undefined;
                    password: {
                        hash: (password: string) => Promise<string>;
                        verify: (data: {
                            password: string;
                            hash: string;
                        }) => Promise<boolean>;
                        config: {
                            minPasswordLength: number;
                            maxPasswordLength: number;
                        };
                        checkPassword: (userId: string, ctx: import("better-auth").GenericEndpointContext<BetterAuthOptions>) => Promise<boolean>;
                    };
                    tables: import("better-auth").BetterAuthDBSchema;
                    runMigrations: () => Promise<void>;
                    publishTelemetry: (event: {
                        type: string;
                        anonymousId?: string | undefined;
                        payload: Record<string, any>;
                    }) => Promise<void>;
                    skipOriginCheck: boolean | string[];
                    skipCSRFCheck: boolean;
                    runInBackground: (promise: Promise<void>) => void;
                    runInBackgroundOrAwait: (promise: Promise<unknown> | Promise<void> | void | unknown) => Promise<unknown>;
                }>;
            }>;
        }[];
    };
    endpoints: {
        createApiKey: import("better-auth").StrictEndpoint<"/api-key/create", {
            method: "POST";
            body: import("better-auth").ZodObject<{
                name: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                expiresIn: import("better-auth").ZodDefault<import("better-auth").ZodNullable<import("better-auth").ZodOptional<import("better-auth").ZodNumber>>>;
                userId: import("better-auth").ZodOptional<import("better-auth").ZodCoercedString<unknown>>;
                prefix: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                remaining: import("better-auth").ZodDefault<import("better-auth").ZodNullable<import("better-auth").ZodOptional<import("better-auth").ZodNumber>>>;
                metadata: import("better-auth").ZodOptional<import("better-auth").ZodAny>;
                refillAmount: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                refillInterval: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                rateLimitTimeWindow: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                rateLimitMax: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                rateLimitEnabled: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                permissions: import("better-auth").ZodOptional<import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString>>>;
            }, import("better-auth").$strip>;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            id: {
                                                type: string;
                                                description: string;
                                            };
                                            createdAt: {
                                                type: string;
                                                format: string;
                                                description: string;
                                            };
                                            updatedAt: {
                                                type: string;
                                                format: string;
                                                description: string;
                                            };
                                            name: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            prefix: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            start: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            key: {
                                                type: string;
                                                description: string;
                                            };
                                            enabled: {
                                                type: string;
                                                description: string;
                                            };
                                            expiresAt: {
                                                type: string;
                                                format: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            userId: {
                                                type: string;
                                                description: string;
                                            };
                                            lastRefillAt: {
                                                type: string;
                                                format: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            lastRequest: {
                                                type: string;
                                                format: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            metadata: {
                                                type: string;
                                                nullable: boolean;
                                                additionalProperties: boolean;
                                                description: string;
                                            };
                                            rateLimitMax: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            rateLimitTimeWindow: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            remaining: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            refillAmount: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            refillInterval: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            rateLimitEnabled: {
                                                type: string;
                                                description: string;
                                            };
                                            requestCount: {
                                                type: string;
                                                description: string;
                                            };
                                            permissions: {
                                                type: string;
                                                nullable: boolean;
                                                additionalProperties: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
                                                };
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            };
        }, {
            key: string;
            metadata: any;
            permissions: any;
            id: string;
            name: string | null;
            start: string | null;
            prefix: string | null;
            userId: string;
            refillInterval: number | null;
            refillAmount: number | null;
            lastRefillAt: Date | null;
            enabled: boolean;
            rateLimitEnabled: boolean;
            rateLimitTimeWindow: number | null;
            rateLimitMax: number | null;
            requestCount: number;
            remaining: number | null;
            lastRequest: Date | null;
            expiresAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }>;
        verifyApiKey: import("better-auth").StrictEndpoint<string, {
            method: "POST";
            body: import("better-auth").ZodObject<{
                key: import("better-auth").ZodString;
                permissions: import("better-auth").ZodOptional<import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString>>>;
            }, import("better-auth").$strip>;
        }, {
            valid: boolean;
            error: {
                message: string | undefined;
                code: string;
            };
            key: null;
        } | {
            valid: boolean;
            error: null;
            key: Omit<import("better-auth/plugins").ApiKey, "key"> | null;
        }>;
        getApiKey: import("better-auth").StrictEndpoint<"/api-key/get", {
            method: "GET";
            query: import("better-auth").ZodObject<{
                id: import("better-auth").ZodString;
            }, import("better-auth").$strip>;
            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            id: {
                                                type: string;
                                                description: string;
                                            };
                                            name: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            start: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            prefix: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            userId: {
                                                type: string;
                                                description: string;
                                            };
                                            refillInterval: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            refillAmount: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            lastRefillAt: {
                                                type: string;
                                                format: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            enabled: {
                                                type: string;
                                                description: string;
                                                default: boolean;
                                            };
                                            rateLimitEnabled: {
                                                type: string;
                                                description: string;
                                            };
                                            rateLimitTimeWindow: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            rateLimitMax: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            requestCount: {
                                                type: string;
                                                description: string;
                                            };
                                            remaining: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            lastRequest: {
                                                type: string;
                                                format: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            expiresAt: {
                                                type: string;
                                                format: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            createdAt: {
                                                type: string;
                                                format: string;
                                                description: string;
                                            };
                                            updatedAt: {
                                                type: string;
                                                format: string;
                                                description: string;
                                            };
                                            metadata: {
                                                type: string;
                                                nullable: boolean;
                                                additionalProperties: boolean;
                                                description: string;
                                            };
                                            permissions: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            };
        }, {
            metadata: Record<string, any> | null;
            permissions: {
                [key: string]: string[];
            } | null;
            id: string;
            name: string | null;
            start: string | null;
            prefix: string | null;
            userId: string;
            refillInterval: number | null;
            refillAmount: number | null;
            lastRefillAt: Date | null;
            enabled: boolean;
            rateLimitEnabled: boolean;
            rateLimitTimeWindow: number | null;
            rateLimitMax: number | null;
            requestCount: number;
            remaining: number | null;
            lastRequest: Date | null;
            expiresAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }>;
        updateApiKey: import("better-auth").StrictEndpoint<"/api-key/update", {
            method: "POST";
            body: import("better-auth").ZodObject<{
                keyId: import("better-auth").ZodString;
                userId: import("better-auth").ZodOptional<import("better-auth").ZodCoercedString<unknown>>;
                name: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                enabled: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                remaining: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                refillAmount: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                refillInterval: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                metadata: import("better-auth").ZodOptional<import("better-auth").ZodAny>;
                expiresIn: import("better-auth").ZodNullable<import("better-auth").ZodOptional<import("better-auth").ZodNumber>>;
                rateLimitEnabled: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                rateLimitTimeWindow: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                rateLimitMax: import("better-auth").ZodOptional<import("better-auth").ZodNumber>;
                permissions: import("better-auth").ZodNullable<import("better-auth").ZodOptional<import("better-auth").ZodRecord<import("better-auth").ZodString, import("better-auth").ZodArray<import("better-auth").ZodString>>>>;
            }, import("better-auth").$strip>;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            id: {
                                                type: string;
                                                description: string;
                                            };
                                            name: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            start: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            prefix: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            userId: {
                                                type: string;
                                                description: string;
                                            };
                                            refillInterval: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            refillAmount: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            lastRefillAt: {
                                                type: string;
                                                format: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            enabled: {
                                                type: string;
                                                description: string;
                                                default: boolean;
                                            };
                                            rateLimitEnabled: {
                                                type: string;
                                                description: string;
                                            };
                                            rateLimitTimeWindow: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            rateLimitMax: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            requestCount: {
                                                type: string;
                                                description: string;
                                            };
                                            remaining: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            lastRequest: {
                                                type: string;
                                                format: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            expiresAt: {
                                                type: string;
                                                format: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                            createdAt: {
                                                type: string;
                                                format: string;
                                                description: string;
                                            };
                                            updatedAt: {
                                                type: string;
                                                format: string;
                                                description: string;
                                            };
                                            metadata: {
                                                type: string;
                                                nullable: boolean;
                                                additionalProperties: boolean;
                                                description: string;
                                            };
                                            permissions: {
                                                type: string;
                                                nullable: boolean;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            };
        }, {
            metadata: Record<string, any> | null;
            permissions: {
                [key: string]: string[];
            } | null;
            id: string;
            name: string | null;
            start: string | null;
            prefix: string | null;
            userId: string;
            refillInterval: number | null;
            refillAmount: number | null;
            lastRefillAt: Date | null;
            enabled: boolean;
            rateLimitEnabled: boolean;
            rateLimitTimeWindow: number | null;
            rateLimitMax: number | null;
            requestCount: number;
            remaining: number | null;
            lastRequest: Date | null;
            expiresAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }>;
        deleteApiKey: import("better-auth").StrictEndpoint<"/api-key/delete", {
            method: "POST";
            body: import("better-auth").ZodObject<{
                keyId: import("better-auth").ZodString;
            }, import("better-auth").$strip>;
            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    description: string;
                    requestBody: {
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object";
                                    properties: {
                                        keyId: {
                                            type: string;
                                            description: string;
                                        };
                                    };
                                    required: string[];
                                };
                            };
                        };
                    };
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            success: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            };
        }, {
            success: boolean;
        }>;
        listApiKeys: import("better-auth").StrictEndpoint<"/api-key/list", {
            method: "GET";
            use: ((inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                session: {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        image?: string | null | undefined;
                    };
                };
            }>)[];
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array";
                                        items: {
                                            type: string;
                                            properties: {
                                                id: {
                                                    type: string;
                                                    description: string;
                                                };
                                                name: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                start: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                prefix: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                userId: {
                                                    type: string;
                                                    description: string;
                                                };
                                                refillInterval: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                refillAmount: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                lastRefillAt: {
                                                    type: string;
                                                    format: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                enabled: {
                                                    type: string;
                                                    description: string;
                                                    default: boolean;
                                                };
                                                rateLimitEnabled: {
                                                    type: string;
                                                    description: string;
                                                };
                                                rateLimitTimeWindow: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                rateLimitMax: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                requestCount: {
                                                    type: string;
                                                    description: string;
                                                };
                                                remaining: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                lastRequest: {
                                                    type: string;
                                                    format: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                expiresAt: {
                                                    type: string;
                                                    format: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                                createdAt: {
                                                    type: string;
                                                    format: string;
                                                    description: string;
                                                };
                                                updatedAt: {
                                                    type: string;
                                                    format: string;
                                                    description: string;
                                                };
                                                metadata: {
                                                    type: string;
                                                    nullable: boolean;
                                                    additionalProperties: boolean;
                                                    description: string;
                                                };
                                                permissions: {
                                                    type: string;
                                                    nullable: boolean;
                                                    description: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        }, {
            metadata: Record<string, any> | null;
            permissions: {
                [key: string]: string[];
            } | null;
            id: string;
            name: string | null;
            start: string | null;
            prefix: string | null;
            userId: string;
            refillInterval: number | null;
            refillAmount: number | null;
            lastRefillAt: Date | null;
            enabled: boolean;
            rateLimitEnabled: boolean;
            rateLimitTimeWindow: number | null;
            rateLimitMax: number | null;
            requestCount: number;
            remaining: number | null;
            lastRequest: Date | null;
            expiresAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[]>;
        deleteAllExpiredApiKeys: import("better-auth").StrictEndpoint<string, {
            method: "POST";
        }, {
            success: boolean;
            error: unknown;
        }>;
    };
    schema: {
        apikey: {
            fields: {
                name: {
                    type: "string";
                    required: false;
                    input: false;
                };
                start: {
                    type: "string";
                    required: false;
                    input: false;
                };
                prefix: {
                    type: "string";
                    required: false;
                    input: false;
                };
                key: {
                    type: "string";
                    required: true;
                    input: false;
                    index: true;
                };
                userId: {
                    type: "string";
                    references: {
                        model: string;
                        field: string;
                        onDelete: "cascade";
                    };
                    required: true;
                    input: false;
                    index: true;
                };
                refillInterval: {
                    type: "number";
                    required: false;
                    input: false;
                };
                refillAmount: {
                    type: "number";
                    required: false;
                    input: false;
                };
                lastRefillAt: {
                    type: "date";
                    required: false;
                    input: false;
                };
                enabled: {
                    type: "boolean";
                    required: false;
                    input: false;
                    defaultValue: true;
                };
                rateLimitEnabled: {
                    type: "boolean";
                    required: false;
                    input: false;
                    defaultValue: true;
                };
                rateLimitTimeWindow: {
                    type: "number";
                    required: false;
                    input: false;
                    defaultValue: number;
                };
                rateLimitMax: {
                    type: "number";
                    required: false;
                    input: false;
                    defaultValue: number;
                };
                requestCount: {
                    type: "number";
                    required: false;
                    input: false;
                    defaultValue: number;
                };
                remaining: {
                    type: "number";
                    required: false;
                    input: false;
                };
                lastRequest: {
                    type: "date";
                    required: false;
                    input: false;
                };
                expiresAt: {
                    type: "date";
                    required: false;
                    input: false;
                };
                createdAt: {
                    type: "date";
                    required: true;
                    input: false;
                };
                updatedAt: {
                    type: "date";
                    required: true;
                    input: false;
                };
                permissions: {
                    type: "string";
                    required: false;
                    input: false;
                };
                metadata: {
                    type: "string";
                    required: false;
                    input: true;
                    transform: {
                        input(value: import("better-auth").DBPrimitive): string;
                        output(value: import("better-auth").DBPrimitive): any;
                    };
                };
            };
        };
    };
    options: import("better-auth/plugins").ApiKeyOptions | undefined;
};
/**
 * Applies sensible defaults to Better Auth options.
 *
 * Currently applies the following defaults:
 * - `trustedOrigins`: If not explicitly provided but `baseURL` is set,
 *   defaults to `[baseURL]`. This handles the common single-domain case
 *   where the app's origin should be trusted for auth requests.
 *
 * Multi-domain setups can still explicitly set `trustedOrigins` to include
 * multiple origins.
 *
 * @example Simple case - trustedOrigins defaults to [baseURL]
 * ```ts
 * import { withBetterAuthDefaults } from '@delmaredigital/payload-better-auth'
 *
 * const auth = betterAuth(withBetterAuthDefaults({
 *   baseURL: 'https://myapp.com',
 *   // trustedOrigins automatically becomes ['https://myapp.com']
 * }))
 * ```
 *
 * @example Multi-domain case - explicit trustedOrigins respected
 * ```ts
 * const auth = betterAuth(withBetterAuthDefaults({
 *   baseURL: 'https://myapp.com',
 *   trustedOrigins: ['https://myapp.com', 'https://other-domain.com'],
 *   // trustedOrigins stays as explicitly provided
 * }))
 * ```
 *
 * @example With createBetterAuthPlugin
 * ```ts
 * createBetterAuthPlugin({
 *   createAuth: (payload) => betterAuth(withBetterAuthDefaults({
 *     database: payloadAdapter({ payloadClient: payload }),
 *     baseURL: process.env.BETTER_AUTH_URL,
 *   })),
 * })
 * ```
 */
export declare function withBetterAuthDefaults<T extends BetterAuthOptions>(options: T): T;
export {};
