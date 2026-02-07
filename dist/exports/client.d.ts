/**
 * Client-side auth utilities
 * Re-exports createAuthClient from better-auth/react and common plugins
 */
export { createAuthClient } from 'better-auth/react';
export { twoFactorClient, apiKeyClient } from 'better-auth/client/plugins';
export { passkeyClient } from '@better-auth/passkey/client';
/**
 * Default plugins included with Payload Better Auth.
 * Use this with createAuthClient when you need custom plugins with full type safety.
 *
 * @example With custom plugins (full type safety)
 * ```typescript
 * import { createAuthClient, payloadAuthPlugins } from '@delmaredigital/payload-better-auth/client'
 * import { stripeClient } from '@better-auth/stripe/client'
 *
 * export const authClient = createAuthClient({
 *   plugins: [...payloadAuthPlugins, stripeClient({ subscription: true })],
 * })
 *
 * // authClient.subscription is fully typed!
 * ```
 */
export declare const payloadAuthPlugins: readonly [{
    id: "two-factor";
    $InferServerPlugin: ReturnType<(<O extends import("better-auth/plugins").TwoFactorOptions>(options?: O) => {
        id: "two-factor";
        endpoints: {
            enableTwoFactor: import("better-auth").StrictEndpoint<"/two-factor/enable", {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    password: import("better-auth").ZodString;
                    issuer: import("better-auth").ZodOptional<import("better-auth").ZodString>;
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
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                totpURI: {
                                                    type: string;
                                                    description: string;
                                                };
                                                backupCodes: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
                                                    description: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                totpURI: string;
                backupCodes: string[];
            }>;
            disableTwoFactor: import("better-auth").StrictEndpoint<"/two-factor/disable", {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    password: import("better-auth").ZodString;
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
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                status: boolean;
            }>;
            verifyBackupCode: import("better-auth").StrictEndpoint<"/two-factor/verify-backup-code", {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    code: import("better-auth").ZodString;
                    disableSession: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                    trustDevice: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
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
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        emailVerified: {
                                                            type: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        image: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        twoFactorEnabled: {
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
                                                    };
                                                    required: string[];
                                                    description: string;
                                                };
                                                session: {
                                                    type: string;
                                                    properties: {
                                                        token: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        userId: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        createdAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                        expiresAt: {
                                                            type: string;
                                                            format: string;
                                                            description: string;
                                                        };
                                                    };
                                                    required: string[];
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
                token: string | undefined;
                user: (Record<string, any> & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                }) | import("better-auth/plugins").UserWithTwoFactor;
            }>;
            generateBackupCodes: import("better-auth").StrictEndpoint<"/two-factor/generate-backup-codes", {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    password: import("better-auth").ZodString;
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
                                                status: {
                                                    type: string;
                                                    description: string;
                                                    enum: boolean[];
                                                };
                                                backupCodes: {
                                                    type: string;
                                                    items: {
                                                        type: string;
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
                status: boolean;
                backupCodes: string[];
            }>;
            viewBackupCodes: import("better-auth").StrictEndpoint<string, {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    userId: import("better-auth").ZodCoercedString<unknown>;
                }, import("better-auth").$strip>;
            }, {
                status: boolean;
                backupCodes: string[];
            }>;
            sendTwoFactorOTP: import("better-auth").StrictEndpoint<"/two-factor/send-otp", {
                method: "POST";
                body: import("better-auth").ZodOptional<import("better-auth").ZodObject<{
                    trustDevice: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                }, import("better-auth").$strip>>;
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                status: boolean;
            }>;
            verifyTwoFactorOTP: import("better-auth").StrictEndpoint<"/two-factor/verify-otp", {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    code: import("better-auth").ZodString;
                    trustDevice: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                token: {
                                                    type: string;
                                                    description: string;
                                                };
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        email: {
                                                            type: string;
                                                            format: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        emailVerified: {
                                                            type: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                            nullable: boolean;
                                                            description: string;
                                                        };
                                                        image: {
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
                                                    };
                                                    required: string[];
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
                token: string;
                user: import("better-auth/plugins").UserWithTwoFactor;
            } | {
                token: string;
                user: Record<string, any> & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                };
            }>;
            generateTOTP: import("better-auth").StrictEndpoint<string, {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    secret: import("better-auth").ZodString;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                code: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                code: string;
            }>;
            getTOTPURI: import("better-auth").StrictEndpoint<"/two-factor/get-totp-uri", {
                method: "POST";
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
                body: import("better-auth").ZodObject<{
                    password: import("better-auth").ZodString;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                totpURI: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                totpURI: string;
            }>;
            verifyTOTP: import("better-auth").StrictEndpoint<"/two-factor/verify-totp", {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    code: import("better-auth").ZodString;
                    trustDevice: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, {
                token: string;
                user: import("better-auth/plugins").UserWithTwoFactor;
            } | {
                token: string;
                user: Record<string, any> & {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                };
            }>;
        };
        options: NoInfer<O>;
        hooks: {
            after: {
                matcher(context: import("better-auth").HookEndpointContext): boolean;
                handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    twoFactorRedirect: boolean;
                } | undefined>;
            }[];
        };
        schema: {
            user: {
                fields: {
                    twoFactorEnabled: {
                        type: "boolean";
                        required: false;
                        defaultValue: false;
                        input: false;
                    };
                };
            };
            twoFactor: {
                fields: {
                    secret: {
                        type: "string";
                        required: true;
                        returned: false;
                        index: true;
                    };
                    backupCodes: {
                        type: "string";
                        required: true;
                        returned: false;
                    };
                    userId: {
                        type: "string";
                        required: true;
                        returned: false;
                        references: {
                            model: string;
                            field: string;
                        };
                        index: true;
                    };
                };
            };
        };
        rateLimit: {
            pathMatcher(path: string): boolean;
            window: number;
            max: number;
        }[];
        $ERROR_CODES: {
            readonly OTP_NOT_ENABLED: "OTP not enabled";
            readonly OTP_HAS_EXPIRED: "OTP has expired";
            readonly TOTP_NOT_ENABLED: "TOTP not enabled";
            readonly TWO_FACTOR_NOT_ENABLED: "Two factor isn't enabled";
            readonly BACKUP_CODES_NOT_ENABLED: "Backup codes aren't enabled";
            readonly INVALID_BACKUP_CODE: "Invalid backup code";
            readonly INVALID_CODE: "Invalid code";
            readonly TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: "Too many attempts. Please request a new code.";
            readonly INVALID_TWO_FACTOR_COOKIE: "Invalid two factor cookie";
        };
    })>;
    atomListeners: {
        matcher: (path: string) => boolean;
        signal: "$sessionSignal";
    }[];
    pathMethods: {
        "/two-factor/disable": "POST";
        "/two-factor/enable": "POST";
        "/two-factor/send-otp": "POST";
        "/two-factor/generate-backup-codes": "POST";
        "/two-factor/get-totp-uri": "POST";
        "/two-factor/verify-totp": "POST";
        "/two-factor/verify-otp": "POST";
        "/two-factor/verify-backup-code": "POST";
    };
    fetchPlugins: {
        id: string;
        name: string;
        hooks: {
            onSuccess(context: import("better-auth/react").SuccessContext<any>): Promise<void>;
        };
    }[];
}, {
    id: "api-key";
    $InferServerPlugin: ReturnType<(options?: import("better-auth/plugins").ApiKeyOptions | undefined) => {
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
                        options: import("better-auth").BetterAuthOptions;
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
                        adapter: import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
                        internalAdapter: import("better-auth").InternalAdapter<import("better-auth").BetterAuthOptions>;
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
                            checkPassword: (userId: string, ctx: import("better-auth").GenericEndpointContext<import("better-auth").BetterAuthOptions>) => Promise<boolean>;
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
    }>;
    pathMethods: {
        "/api-key/create": "POST";
        "/api-key/delete": "POST";
        "/api-key/delete-all-expired-api-keys": "POST";
    };
}, {
    id: "passkey";
    $InferServerPlugin: ReturnType<(options?: import("@better-auth/passkey").PasskeyOptions | undefined) => {
        id: "passkey";
        endpoints: {
            generatePasskeyRegistrationOptions: import("better-auth").StrictEndpoint<"/passkey/generate-register-options", {
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
                query: import("better-auth").ZodOptional<import("better-auth").ZodObject<{
                    authenticatorAttachment: import("better-auth").ZodOptional<import("better-auth").ZodEnum<{
                        platform: "platform";
                        "cross-platform": "cross-platform";
                    }>>;
                    name: import("better-auth").ZodOptional<import("better-auth").ZodString>;
                }, import("better-auth").$strip>>;
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                parameters: {
                                    query: {
                                        authenticatorAttachment: {
                                            description: string;
                                            required: boolean;
                                        };
                                        name: {
                                            description: string;
                                            required: boolean;
                                        };
                                    };
                                };
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                challenge: {
                                                    type: string;
                                                };
                                                rp: {
                                                    type: string;
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                        };
                                                        id: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                        };
                                                        displayName: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                pubKeyCredParams: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            type: {
                                                                type: string;
                                                            };
                                                            alg: {
                                                                type: string;
                                                            };
                                                        };
                                                    };
                                                };
                                                timeout: {
                                                    type: string;
                                                };
                                                excludeCredentials: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            id: {
                                                                type: string;
                                                            };
                                                            type: {
                                                                type: string;
                                                            };
                                                            transports: {
                                                                type: string;
                                                                items: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                                authenticatorSelection: {
                                                    type: string;
                                                    properties: {
                                                        authenticatorAttachment: {
                                                            type: string;
                                                        };
                                                        requireResidentKey: {
                                                            type: string;
                                                        };
                                                        userVerification: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                attestation: {
                                                    type: string;
                                                };
                                                extensions: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, import("@better-auth/passkey/client").PublicKeyCredentialCreationOptionsJSON>;
            generatePasskeyAuthenticationOptions: import("better-auth").StrictEndpoint<"/passkey/generate-authenticate-options", {
                method: "GET";
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                challenge: {
                                                    type: string;
                                                };
                                                rp: {
                                                    type: string;
                                                    properties: {
                                                        name: {
                                                            type: string;
                                                        };
                                                        id: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                user: {
                                                    type: string;
                                                    properties: {
                                                        id: {
                                                            type: string;
                                                        };
                                                        name: {
                                                            type: string;
                                                        };
                                                        displayName: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                timeout: {
                                                    type: string;
                                                };
                                                allowCredentials: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                        properties: {
                                                            id: {
                                                                type: string;
                                                            };
                                                            type: {
                                                                type: string;
                                                            };
                                                            transports: {
                                                                type: string;
                                                                items: {
                                                                    type: string;
                                                                };
                                                            };
                                                        };
                                                    };
                                                };
                                                userVerification: {
                                                    type: string;
                                                };
                                                authenticatorSelection: {
                                                    type: string;
                                                    properties: {
                                                        authenticatorAttachment: {
                                                            type: string;
                                                        };
                                                        requireResidentKey: {
                                                            type: string;
                                                        };
                                                        userVerification: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                extensions: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, import("@better-auth/passkey/client").PublicKeyCredentialRequestOptionsJSON>;
            verifyPasskeyRegistration: import("better-auth").StrictEndpoint<"/passkey/verify-registration", {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    response: import("better-auth").ZodAny;
                    name: import("better-auth").ZodOptional<import("better-auth").ZodString>;
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
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            $ref: string;
                                        };
                                    };
                                };
                            };
                            400: {
                                description: string;
                            };
                        };
                    };
                };
            }, import("@better-auth/passkey").Passkey | null>;
            verifyPasskeyAuthentication: import("better-auth").StrictEndpoint<"/passkey/verify-authentication", {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    response: import("better-auth").ZodRecord<import("better-auth").ZodAny, import("better-auth").ZodAny>;
                }, import("better-auth").$strip>;
                metadata: {
                    openapi: {
                        operationId: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    $ref: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    $Infer: {
                        body: {
                            response: import("@better-auth/passkey/client").AuthenticationResponseJSON;
                        };
                    };
                };
            }, {
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined;
                    userAgent?: string | null | undefined;
                };
            }>;
            listPasskeys: import("better-auth").StrictEndpoint<"/passkey/list-user-passkeys", {
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
                                                $ref: string;
                                                required: string[];
                                            };
                                            description: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }, import("@better-auth/passkey").Passkey[]>;
            deletePasskey: import("better-auth").StrictEndpoint<"/passkey/delete-passkey", {
                method: "POST";
                body: import("better-auth").ZodObject<{
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
                                                status: {
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
                status: boolean;
            }>;
            updatePasskey: import("better-auth").StrictEndpoint<"/passkey/update-passkey", {
                method: "POST";
                body: import("better-auth").ZodObject<{
                    id: import("better-auth").ZodString;
                    name: import("better-auth").ZodString;
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
                                                passkey: {
                                                    $ref: string;
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
                passkey: import("@better-auth/passkey").Passkey;
            }>;
        };
        schema: {
            passkey: {
                fields: {
                    name: {
                        type: "string";
                        required: false;
                    };
                    publicKey: {
                        type: "string";
                        required: true;
                    };
                    userId: {
                        type: "string";
                        references: {
                            model: string;
                            field: string;
                        };
                        required: true;
                        index: true;
                    };
                    credentialID: {
                        type: "string";
                        required: true;
                        index: true;
                    };
                    counter: {
                        type: "number";
                        required: true;
                    };
                    deviceType: {
                        type: "string";
                        required: true;
                    };
                    backedUp: {
                        type: "boolean";
                        required: true;
                    };
                    transports: {
                        type: "string";
                        required: false;
                    };
                    createdAt: {
                        type: "date";
                        required: false;
                    };
                    aaguid: {
                        type: "string";
                        required: false;
                    };
                };
            };
        };
        $ERROR_CODES: {
            readonly CHALLENGE_NOT_FOUND: "Challenge not found";
            readonly YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY: "You are not allowed to register this passkey";
            readonly FAILED_TO_VERIFY_REGISTRATION: "Failed to verify registration";
            readonly PASSKEY_NOT_FOUND: "Passkey not found";
            readonly AUTHENTICATION_FAILED: "Authentication failed";
            readonly UNABLE_TO_CREATE_SESSION: "Unable to create session";
            readonly FAILED_TO_UPDATE_PASSKEY: "Failed to update passkey";
        };
        options: import("@better-auth/passkey").PasskeyOptions | undefined;
    }>;
    getActions: ($fetch: import("better-auth/react").BetterFetch, $store: import("better-auth").ClientStore) => {
        signIn: {
            passkey: (opts?: {
                autoFill?: boolean;
                fetchOptions?: import("better-auth").ClientFetchOption;
            } | undefined, options?: import("better-auth").ClientFetchOption | undefined) => Promise<{
                data: null;
                error: {
                    message?: string | undefined;
                    status: number;
                    statusText: string;
                };
            } | {
                data: {
                    session: import("better-auth").Session;
                    user: import("better-auth").User;
                };
                error: null;
            } | {
                data: null;
                error: {
                    code: string;
                    message: string;
                    status: number;
                    statusText: string;
                };
            }>;
        };
        passkey: {
            addPasskey: (opts?: {
                fetchOptions?: import("better-auth").ClientFetchOption;
                name?: string;
                authenticatorAttachment?: "platform" | "cross-platform";
                useAutoRegister?: boolean;
            } | undefined, fetchOpts?: import("better-auth").ClientFetchOption | undefined) => Promise<{
                data: null;
                error: {
                    message?: string | undefined;
                    status: number;
                    statusText: string;
                };
            } | {
                data: import("@better-auth/passkey").Passkey;
                error: null;
            } | {
                data: null;
                error: {
                    code: string;
                    message: string;
                    status: number;
                    statusText: string;
                };
            }>;
        };
        $Infer: {
            Passkey: import("@better-auth/passkey").Passkey;
        };
    };
    getAtoms($fetch: import("better-auth/react").BetterFetch): {
        listPasskeys: import("better-auth/client").AuthQueryAtom<import("@better-auth/passkey").Passkey[]>;
        $listPasskeys: import("better-auth/react").PreinitializedWritableAtom<any> & object;
    };
    pathMethods: {
        "/passkey/register": "POST";
        "/passkey/authenticate": "POST";
    };
    atomListeners: ({
        matcher(path: string): path is "/passkey/delete-passkey" | "/passkey/update-passkey" | "/passkey/verify-registration" | "/sign-out";
        signal: "$listPasskeys";
    } | {
        matcher: (path: string) => path is "/passkey/verify-authentication";
        signal: "$sessionSignal";
    })[];
}];
export interface PayloadAuthClientOptions {
    /** Base URL for auth endpoints (defaults to window.location.origin) */
    baseURL?: string;
}
/**
 * Create a pre-configured auth client with default plugins (twoFactor, apiKey, passkey).
 *
 * This is a convenience wrapper for simple setups. For custom plugins with full type
 * safety, use `createAuthClient` with `payloadAuthPlugins` instead.
 *
 * @param options - Optional configuration
 * @param options.baseURL - Base URL for auth endpoints (defaults to window.location.origin)
 *
 * @example Basic usage (no custom plugins)
 * ```typescript
 * import { createPayloadAuthClient } from '@delmaredigital/payload-better-auth/client'
 *
 * export const authClient = createPayloadAuthClient()
 * ```
 *
 * @example With custom plugins (use createAuthClient for full type safety)
 * ```typescript
 * import { createAuthClient, payloadAuthPlugins } from '@delmaredigital/payload-better-auth/client'
 * import { stripeClient } from '@better-auth/stripe/client'
 *
 * export const authClient = createAuthClient({
 *   plugins: [...payloadAuthPlugins, stripeClient({ subscription: true })],
 * })
 * ```
 */
export declare function createPayloadAuthClient(options?: PayloadAuthClientOptions): {
    useListPasskeys: () => {
        data: import("@better-auth/passkey").Passkey[] | null;
        error: null | import("better-auth/react").BetterFetchError;
        isPending: boolean;
        isRefetching: boolean;
        refetch: (queryParams?: {
            query?: import("better-auth").SessionQueryParams;
        } | undefined) => Promise<void>;
    };
} & {
    signOut: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        success: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    resetPassword: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
        newPassword: string;
        token?: string | undefined;
    }> & Record<string, any>, Partial<{
        token?: string | undefined;
    }> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
        newPassword: string;
        token?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    verifyEmail: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<{
        token: string;
        callbackURL?: string | undefined;
    }> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
        query: {
            token: string;
            callbackURL?: string | undefined;
        };
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<NonNullable<void | {
        status: boolean;
    }>, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    sendVerificationEmail: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
        email: string;
        callbackURL?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
        email: string;
        callbackURL?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    changeEmail: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
        newEmail: string;
        callbackURL?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
        newEmail: string;
        callbackURL?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    changePassword: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
        newPassword: string;
        currentPassword: string;
        revokeOtherSessions?: boolean | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
        newPassword: string;
        currentPassword: string;
        revokeOtherSessions?: boolean | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        token: string | null;
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
        } & Record<string, any>;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    deleteUser: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
        callbackURL?: string | undefined;
        password?: string | undefined;
        token?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
        callbackURL?: string | undefined;
        password?: string | undefined;
        token?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        success: boolean;
        message: string;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    requestPasswordReset: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
        email: string;
        redirectTo?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
        email: string;
        redirectTo?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        status: boolean;
        message: string;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    resetPassword: {
        ":token": <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<{
            callbackURL: string;
        }> & Record<string, any>, {
            token: string;
        }>>(data_0: import("better-auth").Prettify<{
            query: {
                callbackURL: string;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<never, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    revokeSession: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
        token: string;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
        token: string;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    revokeSessions: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    revokeOtherSessions: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    linkSocial: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
        provider: unknown;
        callbackURL?: string | undefined;
        idToken?: {
            token: string;
            nonce?: string | undefined;
            accessToken?: string | undefined;
            refreshToken?: string | undefined;
            scopes?: string[] | undefined;
        } | undefined;
        requestSignUp?: boolean | undefined;
        scopes?: string[] | undefined;
        errorCallbackURL?: string | undefined;
        disableRedirect?: boolean | undefined;
        additionalData?: Record<string, any> | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
        provider: unknown;
        callbackURL?: string | undefined;
        idToken?: {
            token: string;
            nonce?: string | undefined;
            accessToken?: string | undefined;
            refreshToken?: string | undefined;
            scopes?: string[] | undefined;
        } | undefined;
        requestSignUp?: boolean | undefined;
        scopes?: string[] | undefined;
        errorCallbackURL?: string | undefined;
        disableRedirect?: boolean | undefined;
        additionalData?: Record<string, any> | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        url: string;
        redirect: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    listAccounts: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        scopes: string[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        providerId: string;
        accountId: string;
    }[], {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    deleteUser: {
        callback: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<{
            token: string;
            callbackURL?: string | undefined;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            query: {
                token: string;
                callbackURL?: string | undefined;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            success: boolean;
            message: string;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    unlinkAccount: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
        providerId: string;
        accountId?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
        providerId: string;
        accountId?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    refreshToken: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        accessToken: string | undefined;
        refreshToken: string | undefined;
        accessTokenExpiresAt: Date | undefined;
        refreshTokenExpiresAt: Date | undefined;
        scope: string | null | undefined;
        idToken: string | null | undefined;
        providerId: string;
        accountId: string;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    getAccessToken: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
        providerId: string;
        accountId?: string | undefined;
        userId?: string | undefined;
    } & {
        fetchOptions?: FetchOptions | undefined;
    }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        accessToken: string;
        accessTokenExpiresAt: Date | undefined;
        scopes: string[];
        idToken: string | undefined;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    accountInfo: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<{
        accountId?: string | undefined;
    }> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
        query?: {
            accountId?: string | undefined;
        } | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        user: import("better-auth").OAuth2UserInfo;
        data: Record<string, any>;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    twoFactor: {
        enable: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            password: string;
            issuer?: string | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            password: string;
            issuer?: string | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            totpURI: string;
            backupCodes: string[];
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    twoFactor: {
        disable: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            password: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            password: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            status: boolean;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    twoFactor: {
        verifyBackupCode: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            code: string;
            disableSession?: boolean | undefined;
            trustDevice?: boolean | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            code: string;
            disableSession?: boolean | undefined;
            trustDevice?: boolean | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            token: string | undefined;
            user: (Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            }) | import("better-auth/plugins").UserWithTwoFactor;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    twoFactor: {
        generateBackupCodes: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            password: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            password: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            status: boolean;
            backupCodes: string[];
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    twoFactor: {
        sendOtp: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            trustDevice?: boolean | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
            query?: Record<string, any> | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            status: boolean;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    twoFactor: {
        verifyOtp: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            code: string;
            trustDevice?: boolean | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            code: string;
            trustDevice?: boolean | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<NonNullable<{
            token: string;
            user: import("better-auth/plugins").UserWithTwoFactor;
        } | {
            token: string;
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        }>, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    twoFactor: {
        getTotpUri: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            password: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            password: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            totpURI: string;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    twoFactor: {
        verifyTotp: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            code: string;
            trustDevice?: boolean | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            code: string;
            trustDevice?: boolean | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<NonNullable<{
            token: string;
            user: import("better-auth/plugins").UserWithTwoFactor;
        } | {
            token: string;
            user: Record<string, any> & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
            };
        }>, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    apiKey: {
        create: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            name?: string | undefined;
            expiresIn?: number | null | undefined;
            userId?: unknown;
            prefix?: string | undefined;
            remaining?: number | null | undefined;
            metadata?: any;
            refillAmount?: number | undefined;
            refillInterval?: number | undefined;
            rateLimitTimeWindow?: number | undefined;
            rateLimitMax?: number | undefined;
            rateLimitEnabled?: boolean | undefined;
            permissions?: Record<string, string[]> | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
            name?: string | undefined;
            expiresIn?: number | null | undefined;
            userId?: unknown;
            prefix?: string | undefined;
            remaining?: number | null | undefined;
            metadata?: any;
            refillAmount?: number | undefined;
            refillInterval?: number | undefined;
            rateLimitTimeWindow?: number | undefined;
            rateLimitMax?: number | undefined;
            rateLimitEnabled?: boolean | undefined;
            permissions?: Record<string, string[]> | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
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
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    apiKey: {
        get: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<{
            id: string;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            query: {
                id: string;
            };
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
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
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    apiKey: {
        update: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            keyId: string;
            userId?: unknown;
            name?: string | undefined;
            enabled?: boolean | undefined;
            remaining?: number | undefined;
            refillAmount?: number | undefined;
            refillInterval?: number | undefined;
            metadata?: any;
            expiresIn?: number | null | undefined;
            rateLimitEnabled?: boolean | undefined;
            rateLimitTimeWindow?: number | undefined;
            rateLimitMax?: number | undefined;
            permissions?: Record<string, string[]> | null | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            keyId: string;
            userId?: unknown;
            name?: string | undefined;
            enabled?: boolean | undefined;
            remaining?: number | undefined;
            refillAmount?: number | undefined;
            refillInterval?: number | undefined;
            metadata?: any;
            expiresIn?: number | null | undefined;
            rateLimitEnabled?: boolean | undefined;
            rateLimitTimeWindow?: number | undefined;
            rateLimitMax?: number | undefined;
            permissions?: Record<string, string[]> | null | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
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
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    apiKey: {
        delete: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            keyId: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            keyId: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            success: boolean;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    apiKey: {
        list: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
            query?: Record<string, any> | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
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
        }[], {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    passkey: {
        generateRegisterOptions: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<{
            authenticatorAttachment?: "platform" | "cross-platform" | undefined;
            name?: string | undefined;
        }> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
            query?: {
                authenticatorAttachment?: "platform" | "cross-platform" | undefined;
                name?: string | undefined;
            } | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<import("@better-auth/passkey/client").PublicKeyCredentialCreationOptionsJSON, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    passkey: {
        generateAuthenticateOptions: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
            query?: Record<string, any> | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<import("@better-auth/passkey/client").PublicKeyCredentialRequestOptionsJSON, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    passkey: {
        verifyRegistration: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            response: any;
            name?: string | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            response: any;
            name?: string | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<import("@better-auth/passkey").Passkey, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    passkey: {
        verifyAuthentication: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            response: import("@better-auth/passkey/client").AuthenticationResponseJSON;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            response: import("@better-auth/passkey/client").AuthenticationResponseJSON;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    passkey: {
        listUserPasskeys: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
            query?: Record<string, any> | undefined;
            fetchOptions?: FetchOptions | undefined;
        }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<import("@better-auth/passkey").Passkey[], {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    passkey: {
        deletePasskey: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            id: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            id: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            status: boolean;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    passkey: {
        updatePasskey: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            id: string;
            name: string;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            id: string;
            name: string;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            passkey: import("@better-auth/passkey").Passkey;
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    signIn: {
        social: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            provider: (string & {}) | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "huggingface" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linear" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "vercel";
            callbackURL?: string | undefined;
            newUserCallbackURL?: string | undefined;
            errorCallbackURL?: string | undefined;
            disableRedirect?: boolean | undefined;
            idToken?: {
                token: string;
                nonce?: string | undefined;
                accessToken?: string | undefined;
                refreshToken?: string | undefined;
                expiresAt?: number | undefined;
            } | undefined;
            scopes?: string[] | undefined;
            requestSignUp?: boolean | undefined;
            loginHint?: string | undefined;
            additionalData?: Record<string, any> | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            provider: (string & {}) | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "huggingface" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linear" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "vercel";
            callbackURL?: string | undefined;
            newUserCallbackURL?: string | undefined;
            errorCallbackURL?: string | undefined;
            disableRedirect?: boolean | undefined;
            idToken?: {
                token: string;
                nonce?: string | undefined;
                accessToken?: string | undefined;
                refreshToken?: string | undefined;
                expiresAt?: number | undefined;
            } | undefined;
            scopes?: string[] | undefined;
            requestSignUp?: boolean | undefined;
            loginHint?: string | undefined;
            additionalData?: Record<string, any> | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<NonNullable<{
            redirect: boolean;
            url: string;
        } | {
            redirect: boolean;
            token: string;
            url: undefined;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
        }>, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    signUp: {
        email: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            name: string;
            email: string;
            password: string;
            image?: string | undefined;
            callbackURL?: string | undefined;
            rememberMe?: boolean | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            email: string;
            name: string;
            password: string;
            image?: string | undefined;
            callbackURL?: string | undefined;
            fetchOptions?: FetchOptions | undefined;
        } & {} & {}>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<NonNullable<{
            token: null;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
        } | {
            token: string;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
        }>, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    signIn: {
        email: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<{
            email: string;
            password: string;
            callbackURL?: string | undefined;
            rememberMe?: boolean | undefined;
        }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0: import("better-auth").Prettify<{
            email: string;
            password: string;
            callbackURL?: string | undefined;
            rememberMe?: boolean | undefined;
        } & {
            fetchOptions?: FetchOptions | undefined;
        }>, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
            redirect: boolean;
            token: string;
            url?: string | undefined;
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
        }, {
            code?: string | undefined;
            message?: string | undefined;
        }, FetchOptions["throw"] extends true ? true : false>>;
    };
} & {
    updateUser: <FetchOptions extends import("better-auth").ClientFetchOption<Partial<Partial<{}> & {
        name?: string | undefined;
        image?: string | undefined | null;
    }> & Record<string, any>, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
        image?: (string | null) | undefined;
        name?: string | undefined;
        fetchOptions?: FetchOptions | undefined;
    } & Partial<{} & {}>> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        status: boolean;
    }, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    listSessions: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<Record<string, any>> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
        query?: Record<string, any> | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<import("better-auth").Prettify<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined | undefined;
        userAgent?: string | null | undefined | undefined;
    }>[], {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    getSession: <FetchOptions extends import("better-auth").ClientFetchOption<never, Partial<{
        disableCookieCache?: unknown;
        disableRefresh?: unknown;
    }> & Record<string, any>, Record<string, any> | undefined>>(data_0?: import("better-auth").Prettify<{
        query?: {
            disableCookieCache?: unknown;
            disableRefresh?: unknown;
        } | undefined;
        fetchOptions?: FetchOptions | undefined;
    }> | undefined, data_1?: FetchOptions | undefined) => Promise<import("better-auth/react").BetterFetchResponse<{
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
            twoFactorEnabled: boolean | null | undefined;
        };
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
        };
    } | null, {
        code?: string | undefined;
        message?: string | undefined;
    }, FetchOptions["throw"] extends true ? true : false>>;
} & {
    signIn: {
        passkey: (opts?: {
            autoFill?: boolean;
            fetchOptions?: import("better-auth").ClientFetchOption;
        } | undefined, options?: import("better-auth").ClientFetchOption | undefined) => Promise<{
            data: null;
            error: {
                message?: string | undefined;
                status: number;
                statusText: string;
            };
        } | {
            data: {
                session: import("better-auth").Session;
                user: import("better-auth").User;
            };
            error: null;
        } | {
            data: null;
            error: {
                code: string;
                message: string;
                status: number;
                statusText: string;
            };
        }>;
    };
    passkey: {
        addPasskey: (opts?: {
            fetchOptions?: import("better-auth").ClientFetchOption;
            name?: string;
            authenticatorAttachment?: "platform" | "cross-platform";
            useAutoRegister?: boolean;
        } | undefined, fetchOpts?: import("better-auth").ClientFetchOption | undefined) => Promise<{
            data: null;
            error: {
                message?: string | undefined;
                status: number;
                statusText: string;
            };
        } | {
            data: import("@better-auth/passkey").Passkey;
            error: null;
        } | {
            data: null;
            error: {
                code: string;
                message: string;
                status: number;
                statusText: string;
            };
        }>;
    };
    $Infer: {
        Passkey: import("@better-auth/passkey").Passkey;
    };
} & {
    useSession: () => {
        data: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
                twoFactorEnabled: boolean | null | undefined;
            };
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
        } | null;
        isPending: boolean;
        isRefetching: boolean;
        error: import("better-auth/react").BetterFetchError | null;
        refetch: (queryParams?: {
            query?: import("better-auth").SessionQueryParams;
        } | undefined) => Promise<void>;
    };
    $Infer: {
        Session: {
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
                twoFactorEnabled: boolean | null | undefined;
            };
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined;
                userAgent?: string | null | undefined;
            };
        };
    };
    $fetch: import("better-auth/react").BetterFetch<{
        plugins: (import("better-auth/react").BetterFetchPlugin<Record<string, any>> | {
            id: string;
            name: string;
            hooks: {
                onSuccess(context: import("better-auth/react").SuccessContext<any>): void;
            };
        } | {
            id: string;
            name: string;
            hooks: {
                onSuccess: ((context: import("better-auth/react").SuccessContext<any>) => Promise<void> | void) | undefined;
                onError: ((context: import("better-auth/react").ErrorContext) => Promise<void> | void) | undefined;
                onRequest: (<T extends Record<string, any>>(context: import("better-auth/react").RequestContext<T>) => Promise<import("better-auth/react").RequestContext | void> | import("better-auth/react").RequestContext | void) | undefined;
                onResponse: ((context: import("better-auth/react").ResponseContext) => Promise<Response | void | import("better-auth/react").ResponseContext> | Response | import("better-auth/react").ResponseContext | void) | undefined;
            };
        })[];
        cache?: RequestCache | undefined;
        method: string;
        window?: null | undefined;
        headers?: (HeadersInit & (HeadersInit | {
            accept: "application/json" | "text/plain" | "application/octet-stream";
            "content-type": "application/json" | "text/plain" | "application/x-www-form-urlencoded" | "multipart/form-data" | "application/octet-stream";
            authorization: "Bearer" | "Basic";
        })) | undefined;
        redirect?: RequestRedirect | undefined;
        credentials?: RequestCredentials;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        mode?: RequestMode | undefined;
        priority?: RequestPriority | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: (AbortSignal | null) | undefined;
        onRetry?: ((response: import("better-auth/react").ResponseContext) => Promise<void> | void) | undefined;
        hookOptions?: {
            cloneResponse?: boolean;
        } | undefined;
        timeout?: number | undefined;
        customFetchImpl: import("better-auth/react").FetchEsque;
        baseURL: string;
        throw?: boolean | undefined;
        auth?: ({
            type: "Bearer";
            token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
        } | {
            type: "Basic";
            username: string | (() => string | undefined) | undefined;
            password: string | (() => string | undefined) | undefined;
        } | {
            type: "Custom";
            prefix: string | (() => string | undefined) | undefined;
            value: string | (() => string | undefined) | undefined;
        }) | undefined;
        body?: any;
        query?: any;
        params?: any;
        duplex?: "full" | "half" | undefined;
        jsonParser: (text: string) => Promise<any> | any;
        retry?: import("better-auth/react").RetryOptions | undefined;
        retryAttempt?: number | undefined;
        output?: (import("better-auth/react").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
        errorSchema?: import("better-auth/react").StandardSchemaV1 | undefined;
        disableValidation?: boolean | undefined;
        disableSignal?: boolean | undefined;
    }, unknown, unknown, {}>;
    $store: {
        notify: (signal?: (Omit<string, "$sessionSignal"> | "$sessionSignal") | undefined) => void;
        listen: (signal: Omit<string, "$sessionSignal"> | "$sessionSignal", listener: (value: boolean, oldValue?: boolean | undefined) => void) => void;
        atoms: Record<string, import("better-auth/react").WritableAtom<any>>;
    };
    $ERROR_CODES: {
        readonly OTP_NOT_ENABLED: "OTP not enabled";
        readonly OTP_HAS_EXPIRED: "OTP has expired";
        readonly TOTP_NOT_ENABLED: "TOTP not enabled";
        readonly TWO_FACTOR_NOT_ENABLED: "Two factor isn't enabled";
        readonly BACKUP_CODES_NOT_ENABLED: "Backup codes aren't enabled";
        readonly INVALID_BACKUP_CODE: "Invalid backup code";
        readonly INVALID_CODE: "Invalid code";
        readonly TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: "Too many attempts. Please request a new code.";
        readonly INVALID_TWO_FACTOR_COOKIE: "Invalid two factor cookie";
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
        readonly CHALLENGE_NOT_FOUND: "Challenge not found";
        readonly YOU_ARE_NOT_ALLOWED_TO_REGISTER_THIS_PASSKEY: "You are not allowed to register this passkey";
        readonly FAILED_TO_VERIFY_REGISTRATION: "Failed to verify registration";
        readonly PASSKEY_NOT_FOUND: "Passkey not found";
        readonly AUTHENTICATION_FAILED: "Authentication failed";
        readonly UNABLE_TO_CREATE_SESSION: "Unable to create session";
        readonly FAILED_TO_UPDATE_PASSKEY: "Failed to update passkey";
        readonly USER_NOT_FOUND: "User not found";
        readonly FAILED_TO_CREATE_USER: "Failed to create user";
        readonly FAILED_TO_CREATE_SESSION: "Failed to create session";
        readonly FAILED_TO_UPDATE_USER: "Failed to update user";
        readonly FAILED_TO_GET_SESSION: "Failed to get session";
        readonly INVALID_PASSWORD: "Invalid password";
        readonly INVALID_EMAIL: "Invalid email";
        readonly INVALID_EMAIL_OR_PASSWORD: "Invalid email or password";
        readonly SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked";
        readonly PROVIDER_NOT_FOUND: "Provider not found";
        readonly INVALID_TOKEN: "Invalid token";
        readonly ID_TOKEN_NOT_SUPPORTED: "id_token not supported";
        readonly FAILED_TO_GET_USER_INFO: "Failed to get user info";
        readonly USER_EMAIL_NOT_FOUND: "User email not found";
        readonly EMAIL_NOT_VERIFIED: "Email not verified";
        readonly PASSWORD_TOO_SHORT: "Password too short";
        readonly PASSWORD_TOO_LONG: "Password too long";
        readonly USER_ALREADY_EXISTS: "User already exists.";
        readonly USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.";
        readonly EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated";
        readonly CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found";
        readonly SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.";
        readonly FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account";
        readonly ACCOUNT_NOT_FOUND: "Account not found";
        readonly USER_ALREADY_HAS_PASSWORD: "User already has a password. Provide that to delete the account.";
        readonly CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: "Cross-site navigation login blocked. This request appears to be a CSRF attack.";
        readonly VERIFICATION_EMAIL_NOT_ENABLED: "Verification email isn't enabled";
        readonly EMAIL_ALREADY_VERIFIED: "Email is already verified";
        readonly EMAIL_MISMATCH: "Email mismatch";
        readonly SESSION_NOT_FRESH: "Session is not fresh";
        readonly LINKED_ACCOUNT_ALREADY_EXISTS: "Linked account already exists";
        readonly INVALID_ORIGIN: "Invalid origin";
        readonly INVALID_CALLBACK_URL: "Invalid callbackURL";
        readonly INVALID_REDIRECT_URL: "Invalid redirectURL";
        readonly INVALID_ERROR_CALLBACK_URL: "Invalid errorCallbackURL";
        readonly INVALID_NEW_USER_CALLBACK_URL: "Invalid newUserCallbackURL";
        readonly MISSING_OR_NULL_ORIGIN: "Missing or null Origin";
        readonly CALLBACK_URL_REQUIRED: "callbackURL is required";
        readonly FAILED_TO_CREATE_VERIFICATION: "Unable to create verification";
        readonly FIELD_NOT_ALLOWED: "Field not allowed to be set";
        readonly ASYNC_VALIDATION_NOT_SUPPORTED: "Async validation is not supported";
        readonly VALIDATION_ERROR: "Validation Error";
        readonly MISSING_FIELD: "Field is required";
    };
};
export type PayloadAuthClient = ReturnType<typeof createPayloadAuthClient>;
