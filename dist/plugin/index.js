/**
 * Payload Plugins for Better Auth
 *
 * @packageDocumentation
 */ import { detectAuthConfig } from '../utils/detectAuthConfig.js';
import { detectEnabledPlugins } from '../utils/detectEnabledPlugins.js';
import { buildAvailableScopes, scopesToPermissions } from '../utils/generateScopes.js';
// Track auth instance for HMR
let authInstance = null;
// Store API key scopes config for access by management views
let apiKeyScopesConfig = undefined;
/**
 * Get the configured API key scopes config.
 * Used by the ApiKeysView to build available scopes.
 */ export function getApiKeyScopesConfig() {
    return apiKeyScopesConfig;
}
/**
 * Handle API key creation with scopes server-side.
 * Converts scopes to permissions and calls Better Auth's server API.
 */ async function handleApiKeyCreateWithScopes(authApi, payload, headers, body) {
    try {
        // Get the current session to find the user
        const session = await authApi.getSession({
            headers
        });
        if (!session?.user?.id) {
            return new Response(JSON.stringify({
                error: 'Unauthorized'
            }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Extract scopes from the request body
        const scopes = body.scopes ?? [];
        // Build permissions from scopes if any are provided
        let permissions;
        if (scopes.length > 0) {
            const scopesConfig = getApiKeyScopesConfig();
            const availableScopes = buildAvailableScopes(payload.config.collections, scopesConfig);
            permissions = scopesToPermissions(scopes, availableScopes);
        }
        // Build the API key creation options
        const createOptions = {
            body: {
                name: body.name,
                userId: session.user.id,
                expiresIn: body.expiresIn,
                prefix: body.prefix,
                permissions: permissions && Object.keys(permissions).length > 0 ? permissions : undefined,
                metadata: scopes.length > 0 ? {
                    ...body.metadata,
                    scopes
                } : body.metadata
            }
        };
        // Call Better Auth's server-side API
        if (typeof authApi.createApiKey !== 'function') {
            return new Response(JSON.stringify({
                error: 'API key plugin not enabled'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        try {
            const result = await authApi.createApiKey(createOptions);
            return new Response(JSON.stringify(result), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (createError) {
            // Check if error is due to metadata being disabled
            const errorMessage = createError instanceof Error ? createError.message : String(createError);
            const isMetadataDisabled = errorMessage.toLowerCase().includes('metadata') && errorMessage.toLowerCase().includes('disabled');
            if (isMetadataDisabled && createOptions.body.metadata) {
                // Retry without metadata - key will still work, just won't show scopes in UI
                console.warn('[better-auth] Metadata disabled, creating API key without scope metadata. Enable metadata with apiKeyWithDefaults() for better UX.');
                const optionsWithoutMetadata = {
                    body: {
                        ...createOptions.body,
                        metadata: undefined
                    }
                };
                const result = await authApi.createApiKey(optionsWithoutMetadata);
                return new Response(JSON.stringify(result), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            // Re-throw other errors
            throw createError;
        }
    } catch (error) {
        console.error('[better-auth] API key creation error:', error);
        const message = error instanceof Error ? error.message : 'Failed to create API key';
        return new Response(JSON.stringify({
            error: message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
/**
 * Creates the auth endpoint handler that proxies requests to Better Auth.
 */ function createAuthEndpointHandler() {
    return async (req)=>{
        const payloadWithAuth = req.payload;
        const auth = payloadWithAuth.betterAuth;
        if (!auth) {
            return new Response(JSON.stringify({
                error: 'Better Auth not initialized'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        try {
            // Construct the full URL for Better Auth
            // PayloadRequest provides these properties
            const protocol = req.headers.get('x-forwarded-proto') || 'http';
            const host = req.headers.get('host') || 'localhost';
            const pathname = req.pathname || '';
            const search = req.search || req.url?.split('?')[1] || '';
            const url = new URL(pathname, `${protocol}://${host}`);
            if (search) {
                url.search = search.startsWith('?') ? search : `?${search}`;
            }
            // Get request body for non-GET methods
            let body;
            let parsedBody;
            if (req.method && ![
                'GET',
                'HEAD'
            ].includes(req.method)) {
                try {
                    // Try to get body from request
                    if (typeof req.text === 'function') {
                        body = await req.text();
                        if (body) {
                            try {
                                parsedBody = JSON.parse(body);
                            } catch  {
                            // Not JSON, that's okay
                            }
                        }
                    } else if (req.data) {
                        parsedBody = req.data;
                        body = JSON.stringify(parsedBody);
                    }
                } catch  {
                    // Body might already be consumed, try data property
                    if (req.data) {
                        parsedBody = req.data;
                        body = JSON.stringify(parsedBody);
                    }
                }
            }
            // Intercept API key creation requests with scopes
            // Better Auth's API key create endpoint is POST /api-key/create
            const isApiKeyCreate = req.method === 'POST' && pathname.endsWith('/api-key/create') && parsedBody?.scopes && Array.isArray(parsedBody.scopes);
            if (isApiKeyCreate && parsedBody) {
                return handleApiKeyCreateWithScopes(auth.api, req.payload, req.headers, parsedBody);
            }
            // Create a new Request for Better Auth
            const request = new Request(url.toString(), {
                method: req.method || 'GET',
                headers: req.headers,
                body
            });
            const response = await auth.handler(request);
            return response;
        } catch (error) {
            console.error('[better-auth] Endpoint handler error:', error);
            return new Response(JSON.stringify({
                error: 'Internal server error'
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
}
/**
 * Generates Payload endpoints for Better Auth.
 */ function generateAuthEndpoints(basePath) {
    const handler = createAuthEndpointHandler();
    const methods = [
        'get',
        'post',
        'patch',
        'put',
        'delete'
    ];
    return methods.map((method)=>({
            path: `${basePath}/:path*`,
            method,
            handler
        }));
}
/**
 * Injects admin components into the Payload config when disableLocalStrategy is detected.
 */ function injectAdminComponents(config, options) {
    const authDetection = detectAuthConfig(config);
    // Skip if not using disableLocalStrategy or auto-injection is disabled
    if (!authDetection.hasDisableLocalStrategy || options.autoInjectAdminComponents === false) {
        return config;
    }
    const adminOptions = options.admin ?? {};
    const existingComponents = config.admin?.components ?? {};
    // Build logout button config
    const logoutButton = adminOptions.disableLogoutButton ? existingComponents.logout?.Button : adminOptions.logoutButtonComponent ?? '@delmaredigital/payload-better-auth/components#LogoutButton';
    // Build beforeLogin config
    const existingBeforeLogin = existingComponents.beforeLogin ?? [];
    const beforeLogin = adminOptions.disableBeforeLogin ? existingBeforeLogin : [
        ...Array.isArray(existingBeforeLogin) ? existingBeforeLogin : [
            existingBeforeLogin
        ],
        adminOptions.beforeLoginComponent ?? '@delmaredigital/payload-better-auth/components#BeforeLogin'
    ];
    // Build login view config
    const existingViews = existingComponents.views ?? {};
    const newLoginView = adminOptions.disableLoginView ? undefined : {
        Component: adminOptions.loginViewComponent ?? '@delmaredigital/payload-better-auth/rsc#LoginViewWrapper',
        path: '/login'
    };
    const views = {
        ...existingViews,
        ...newLoginView ? {
            login: newLoginView
        } : {}
    };
    // Store login config in config.custom for the RSC wrapper to read
    const loginConfig = adminOptions.login ?? {};
    // Note: enabledPlugins will be added by injectManagementComponents
    return {
        ...config,
        custom: {
            ...config.custom,
            betterAuth: {
                ...config.custom?.betterAuth,
                login: loginConfig
            }
        },
        admin: {
            ...config.admin,
            components: {
                ...existingComponents,
                logout: logoutButton ? {
                    ...typeof existingComponents.logout === 'object' ? existingComponents.logout : {},
                    Button: logoutButton
                } : existingComponents.logout,
                beforeLogin,
                views
            }
        }
    };
}
/**
 * Injects management UI components into the Payload config based on enabled plugins.
 */ function injectManagementComponents(config, options) {
    const adminOptions = options.admin ?? {};
    // Skip if management UI is disabled
    if (adminOptions.enableManagementUI === false) {
        return config;
    }
    // Detect which plugins are enabled
    const enabledPlugins = detectEnabledPlugins(adminOptions.betterAuthOptions);
    // Get custom paths or use defaults
    const paths = {
        twoFactor: adminOptions.managementPaths?.twoFactor ?? '/security/two-factor',
        apiKeys: adminOptions.managementPaths?.apiKeys ?? '/security/api-keys',
        passkeys: adminOptions.managementPaths?.passkeys ?? '/security/passkeys'
    };
    const existingComponents = config.admin?.components ?? {};
    const existingViews = existingComponents.views ?? {};
    const existingAfterNavLinks = existingComponents.afterNavLinks ?? [];
    // Build management views based on enabled plugins
    // Note: Sessions and passkeys use Payload's default collection views
    const managementViews = {};
    // Two-factor (if enabled)
    if (enabledPlugins.hasTwoFactor) {
        managementViews.securityTwoFactor = {
            Component: '@delmaredigital/payload-better-auth/rsc#TwoFactorView',
            path: paths.twoFactor
        };
    }
    // API keys (if enabled)
    if (enabledPlugins.hasApiKey) {
        managementViews.securityApiKeys = {
            Component: '@delmaredigital/payload-better-auth/rsc#ApiKeysView',
            path: paths.apiKeys
        };
    }
    // Passkeys (if enabled)
    if (enabledPlugins.hasPasskey) {
        managementViews.securityPasskeys = {
            Component: '@delmaredigital/payload-better-auth/rsc#PasskeysView',
            path: paths.passkeys
        };
    }
    // Only add nav links if at least one plugin is enabled
    const hasAnyPlugin = enabledPlugins.hasTwoFactor || enabledPlugins.hasApiKey || enabledPlugins.hasPasskey;
    // Add SecurityNavLinks to afterNavLinks with clientProps for enabled plugins
    const afterNavLinks = hasAnyPlugin ? [
        ...Array.isArray(existingAfterNavLinks) ? existingAfterNavLinks : [
            existingAfterNavLinks
        ],
        {
            path: '@delmaredigital/payload-better-auth/components/management#SecurityNavLinks',
            clientProps: {
                showTwoFactor: enabledPlugins.hasTwoFactor,
                showApiKeys: enabledPlugins.hasApiKey,
                showPasskeys: enabledPlugins.hasPasskey
            }
        }
    ] : existingAfterNavLinks;
    return {
        ...config,
        admin: {
            ...config.admin,
            components: {
                ...existingComponents,
                views: {
                    ...existingViews,
                    ...managementViews
                },
                afterNavLinks
            }
        }
    };
}
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
 */ export function createBetterAuthPlugin(options) {
    const { createAuth, authBasePath = '/auth', autoRegisterEndpoints = true, autoInjectAdminComponents = true } = options;
    // Store API key scopes config for access by management views
    apiKeyScopesConfig = options.admin?.apiKey;
    return (incomingConfig)=>{
        // Inject admin components if enabled
        let config = autoInjectAdminComponents ? injectAdminComponents(incomingConfig, options) : incomingConfig;
        // Inject management UI components
        config = injectManagementComponents(config, options);
        // Generate auth endpoints if enabled
        const authEndpoints = autoRegisterEndpoints ? generateAuthEndpoints(authBasePath) : [];
        // Merge endpoints
        const existingEndpoints = config.endpoints ?? [];
        // Get existing onInit
        const existingOnInit = config.onInit;
        return {
            ...config,
            endpoints: [
                ...existingEndpoints,
                ...authEndpoints
            ],
            onInit: async (payload)=>{
                if (existingOnInit) {
                    await existingOnInit(payload);
                }
                // Check if already attached (HMR scenario)
                if ('betterAuth' in payload) {
                    return;
                }
                // Reuse or create auth instance
                if (!authInstance) {
                    try {
                        authInstance = createAuth(payload);
                    } catch (error) {
                        console.error('[better-auth] Failed to create auth:', error);
                        throw error;
                    }
                }
                // Attach to payload for global access
                Object.defineProperty(payload, 'betterAuth', {
                    value: authInstance,
                    writable: false,
                    enumerable: false,
                    configurable: false
                });
            }
        };
    };
}
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
 */ export function betterAuthStrategy(options = {}) {
    const { usersCollection = 'users', membersCollection = 'members' } = options;
    return {
        name: 'better-auth',
        authenticate: async ({ payload, headers })=>{
            try {
                const payloadWithAuth = payload;
                const auth = payloadWithAuth.betterAuth;
                if (!auth) {
                    console.error('Better Auth not initialized on payload instance');
                    return {
                        user: null
                    };
                }
                const sessionData = await auth.api.getSession({
                    headers
                });
                if (!sessionData?.user?.id) {
                    return {
                        user: null
                    };
                }
                const users = await payload.find({
                    collection: usersCollection,
                    where: {
                        id: {
                            equals: sessionData.user.id
                        }
                    },
                    limit: 1,
                    depth: 0
                });
                if (users.docs.length === 0) {
                    return {
                        user: null
                    };
                }
                // Extract session fields to merge onto user (e.g., activeOrganizationId from org plugin)
                // Exclude fields that might conflict with user fields
                const { id: _sessionId, userId: _userId, expiresAt: _expiresAt, token: _token, ...sessionFields } = sessionData.session || {};
                // If there's an active organization, fetch the user's role in that org
                let organizationRole;
                if (sessionFields.activeOrganizationId) {
                    try {
                        const memberships = await payload.find({
                            collection: membersCollection,
                            where: {
                                and: [
                                    {
                                        user: {
                                            equals: sessionData.user.id
                                        }
                                    },
                                    {
                                        organization: {
                                            equals: sessionFields.activeOrganizationId
                                        }
                                    }
                                ]
                            },
                            limit: 1,
                            depth: 0
                        });
                        if (memberships.docs.length > 0) {
                            organizationRole = memberships.docs[0].role;
                        }
                    } catch  {
                    // Members collection might not exist (org plugin not used), silently ignore
                    }
                }
                return {
                    user: {
                        ...users.docs[0],
                        ...sessionFields,
                        ...organizationRole && {
                            organizationRole
                        },
                        collection: usersCollection,
                        _strategy: 'better-auth'
                    }
                };
            } catch (error) {
                console.error('Better Auth strategy error:', error);
                return {
                    user: null
                };
            }
        }
    };
}
/**
 * Reset the auth instance (useful for testing)
 */ export function resetAuthInstance() {
    authInstance = null;
}
