/**
 * Access control utilities for Payload collections.
 *
 * These helpers simplify common access control patterns when using
 * Better Auth with Payload CMS. They handle role checking, self-access
 * patterns, and field-level permissions.
 *
 * @example
 * ```ts
 * import { isAdmin, isAdminOrSelf } from '@delmaredigital/payload-better-auth'
 *
 * export const Users: CollectionConfig = {
 *   slug: 'users',
 *   access: {
 *     read: isAdminOrSelf({ adminRoles: ['admin', 'editor'] }),
 *     update: isAdminOrSelf({ adminRoles: ['admin'] }),
 *     delete: isAdmin({ adminRoles: ['admin'] }),
 *   },
 * }
 * ```
 */ // ─────────────────────────────────────────────────────────────────────────────
// Role Checking Utilities
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Normalize a user's role to an array.
 *
 * Handles various role formats:
 * - Array of roles
 * - Comma-separated string
 * - Single role string
 *
 * @param role - The role value from the user object
 * @returns Array of role strings
 */ export function normalizeRoles(role) {
    if (Array.isArray(role)) {
        return role.filter((r)=>typeof r === 'string');
    }
    if (typeof role === 'string') {
        if (role.includes(',')) {
            return role.split(',').map((r)=>r.trim()).filter(Boolean);
        }
        return role ? [
            role
        ] : [];
    }
    return [];
}
/**
 * Check if a user has any of the specified roles.
 *
 * @param user - The user object
 * @param roles - Roles to check for
 * @returns True if user has at least one matching role
 *
 * @example
 * ```ts
 * const user = { role: ['admin', 'editor'] }
 * hasAnyRole(user, ['admin']) // true
 * hasAnyRole(user, ['superadmin']) // false
 * ```
 */ export function hasAnyRole(user, roles) {
    if (!user?.role) return false;
    const userRoles = normalizeRoles(user.role);
    return userRoles.some((role)=>roles.includes(role));
}
/**
 * Check if a user has all of the specified roles.
 *
 * @param user - The user object
 * @param roles - Roles to check for
 * @returns True if user has all matching roles
 *
 * @example
 * ```ts
 * const user = { role: ['admin', 'editor'] }
 * hasAllRoles(user, ['admin', 'editor']) // true
 * hasAllRoles(user, ['admin', 'superadmin']) // false
 * ```
 */ export function hasAllRoles(user, roles) {
    if (!user?.role) return false;
    const userRoles = normalizeRoles(user.role);
    return roles.every((role)=>userRoles.includes(role));
}
// ─────────────────────────────────────────────────────────────────────────────
// Access Control Functions
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Check if the current request user has admin roles.
 *
 * Use this as a reusable check within access functions.
 *
 * @param config - Configuration with admin roles
 * @returns Access check function
 */ export function hasAdminRoles(config = {}) {
    const { adminRoles = [
        'admin'
    ] } = config;
    return ({ req })=>{
        return hasAnyRole(req.user, adminRoles);
    };
}
/**
 * Access control: Only allow users with admin roles.
 *
 * @param config - Configuration with admin roles
 * @returns Payload access function
 *
 * @example
 * ```ts
 * access: {
 *   delete: isAdmin({ adminRoles: ['admin', 'superadmin'] }),
 * }
 * ```
 */ export function isAdmin(config = {}) {
    const checkAdmin = hasAdminRoles(config);
    return ({ req })=>{
        return checkAdmin({
            req
        });
    };
}
/**
 * Field access control: Only allow users with admin roles.
 *
 * @param config - Configuration with admin roles
 * @returns Payload field access function
 *
 * @example
 * ```ts
 * fields: [
 *   {
 *     name: 'role',
 *     type: 'select',
 *     access: {
 *       update: isAdminField({ adminRoles: ['admin'] }),
 *     },
 *   },
 * ]
 * ```
 */ export function isAdminField(config = {}) {
    const checkAdmin = hasAdminRoles(config);
    return ({ req })=>{
        return checkAdmin({
            req
        });
    };
}
/**
 * Access control: Allow admin OR the user accessing their own record.
 *
 * Returns a query constraint for non-admin users to limit access
 * to their own records only.
 *
 * @param config - Configuration with admin roles and ID field
 * @returns Payload access function
 *
 * @example
 * ```ts
 * access: {
 *   read: isAdminOrSelf({ adminRoles: ['admin'] }),
 *   update: isAdminOrSelf({ adminRoles: ['admin'] }),
 * }
 * ```
 */ export function isAdminOrSelf(config = {}) {
    const { adminRoles = [
        'admin'
    ], idField = 'id' } = config;
    const checkAdmin = hasAdminRoles({
        adminRoles
    });
    return ({ req })=>{
        // Admins can access everything
        if (checkAdmin({
            req
        })) return true;
        // Non-authenticated users have no access
        if (!req.user) return false;
        // Restrict to own record
        return {
            [idField]: {
                equals: req.user.id
            }
        };
    };
}
/**
 * Access control: Allow admin OR user updating allowed fields on own record.
 *
 * This is useful for allowing users to update specific fields (like name)
 * on their own profile while preventing them from changing sensitive fields
 * like role.
 *
 * Password changes require `currentPassword` to be provided and validated.
 *
 * @param config - Configuration with admin roles, allowed fields, and user slug
 * @returns Payload access function
 *
 * @example
 * ```ts
 * access: {
 *   update: canUpdateOwnFields({
 *     adminRoles: ['admin'],
 *     allowedFields: ['name', 'image'],
 *     userSlug: 'users',
 *   }),
 * }
 * ```
 */ export function canUpdateOwnFields(config = {}) {
    const { adminRoles = [
        'admin'
    ], allowedFields = [
        'name'
    ], idField = 'id', userSlug = 'users' } = config;
    const checkAdmin = hasAdminRoles({
        adminRoles
    });
    return async ({ req, id, data })=>{
        // Admins can update everything
        if (checkAdmin({
            req
        })) return true;
        // Must be authenticated
        if (!req.user) return false;
        // Must be updating own record
        const userId = req.user[idField];
        if (userId !== id || !data) return false;
        const dataKeys = Object.keys(data);
        const effectiveAllowed = [
            ...allowedFields
        ];
        // Handle password changes specially
        const hasCurrentPassword = dataKeys.includes('currentPassword');
        const hasPassword = dataKeys.includes('password');
        if (hasPassword || hasCurrentPassword) {
            // Both must be provided for password change
            if (!(hasCurrentPassword && hasPassword)) return false;
            try {
                // Verify current password
                if (!req.user.email) return false;
                const result = await req.payload.login({
                    collection: userSlug,
                    data: {
                        email: req.user.email,
                        password: data.currentPassword
                    }
                });
                if (!result) return false;
                effectiveAllowed.push('password', 'currentPassword');
            } catch  {
                return false;
            }
        }
        // Check all fields are allowed
        const hasDisallowed = dataKeys.some((key)=>!effectiveAllowed.includes(key));
        return !hasDisallowed;
    };
}
// ─────────────────────────────────────────────────────────────────────────────
// Authenticated Access
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Access control: Allow any authenticated user.
 *
 * @returns Payload access function
 *
 * @example
 * ```ts
 * access: {
 *   read: isAuthenticated(),
 * }
 * ```
 */ export function isAuthenticated() {
    return ({ req })=>{
        return !!req.user;
    };
}
/**
 * Field access control: Allow any authenticated user.
 *
 * @returns Payload field access function
 */ export function isAuthenticatedField() {
    return ({ req })=>{
        return !!req.user;
    };
}
// ─────────────────────────────────────────────────────────────────────────────
// Role-Based Access
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Access control: Allow users with any of the specified roles.
 *
 * @param roles - Roles that have access
 * @returns Payload access function
 *
 * @example
 * ```ts
 * access: {
 *   read: hasRole(['admin', 'editor', 'viewer']),
 *   update: hasRole(['admin', 'editor']),
 * }
 * ```
 */ export function hasRole(roles) {
    return ({ req })=>{
        return hasAnyRole(req.user, roles);
    };
}
/**
 * Field access control: Allow users with any of the specified roles.
 *
 * @param roles - Roles that have access
 * @returns Payload field access function
 */ export function hasRoleField(roles) {
    return ({ req })=>{
        return hasAnyRole(req.user, roles);
    };
}
/**
 * Access control: Allow users with all of the specified roles.
 *
 * @param roles - All roles required for access
 * @returns Payload access function
 *
 * @example
 * ```ts
 * access: {
 *   delete: requireAllRoles(['admin', 'verified']),
 * }
 * ```
 */ export function requireAllRoles(roles) {
    return ({ req })=>{
        return hasAllRoles(req.user, roles);
    };
}
