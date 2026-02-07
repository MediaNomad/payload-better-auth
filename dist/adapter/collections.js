/**
 * Auto-generate Payload collections from Better Auth schema
 *
 * @packageDocumentation
 */ import { getAuthTables } from 'better-auth/db';
import { isAdmin } from '../utils/access.js';
/**
 * Creates a beforeChange hook that makes the first user an admin.
 */ function createFirstUserAdminHook(options, usersSlug) {
    const { adminRole = 'admin', defaultRole = 'user', roleField = 'role' } = options;
    return async ({ data, operation, req })=>{
        if (operation !== 'create') {
            return data;
        }
        try {
            const { totalDocs } = await req.payload.count({
                collection: usersSlug,
                overrideAccess: true
            });
            if (totalDocs === 0) {
                // First user becomes admin
                return {
                    ...data,
                    [roleField]: adminRole
                };
            }
            // Subsequent users get default role if not already set
            return {
                ...data,
                [roleField]: data[roleField] ?? defaultRole
            };
        } catch (error) {
            // On error, don't block user creation - just use provided or default role
            console.warn('[betterAuthCollections] Failed to check user count:', error);
            return {
                ...data,
                [roleField]: data[roleField] ?? defaultRole
            };
        }
    };
}
/**
 * Inject the first-user-admin hook into a collection's hooks.
 */ function injectFirstUserAdminHook(collection, options, usersSlug) {
    const hook = createFirstUserAdminHook(options, usersSlug);
    const existingHooks = collection.hooks?.beforeChange ?? [];
    return {
        ...collection,
        hooks: {
            ...collection.hooks,
            beforeChange: [
                hook,
                ...Array.isArray(existingHooks) ? existingHooks : [
                    existingHooks
                ]
            ]
        }
    };
}
/**
 * Determine if a field should be saved to JWT.
 * Session-critical fields are included, large data fields are excluded.
 */ function getSaveToJWT(modelKey, fieldName) {
    // Session fields - include core session data
    if (modelKey === 'session') {
        const includeFields = [
            'token',
            'expiresAt',
            'user',
            'userId',
            'ipAddress',
            'userAgent',
            'activeOrganizationId',
            'activeTeamId'
        ];
        const excludeFields = [
            'createdAt',
            'updatedAt'
        ];
        if (includeFields.some((f)=>fieldName === f || fieldName.endsWith(f.charAt(0).toUpperCase() + f.slice(1)))) {
            return true;
        }
        if (excludeFields.includes(fieldName)) {
            return false;
        }
    }
    // User fields - include essential auth data
    if (modelKey === 'user') {
        const includeFields = [
            'role',
            'email',
            'emailVerified',
            'name',
            'twoFactorEnabled',
            'banned'
        ];
        const excludeFields = [
            'image',
            'password',
            'banReason'
        ];
        if (includeFields.includes(fieldName)) {
            return true;
        }
        if (excludeFields.includes(fieldName)) {
            return false;
        }
    }
    // Account fields - generally not in JWT
    if (modelKey === 'account') {
        return false;
    }
    // Verification fields - not in JWT
    if (modelKey === 'verification') {
        return false;
    }
    // Default: don't set (let Payload decide)
    return undefined;
}
/**
 * Simple pluralization (add 's' suffix)
 */ function pluralize(name) {
    if (name.endsWith('s')) return name;
    return `${name}s`;
}
function mapFieldType(type, fieldName, hasReferences) {
    if (hasReferences) {
        return 'relationship';
    }
    switch(type){
        case 'boolean':
            return 'checkbox';
        case 'number':
            return 'number';
        case 'date':
            return 'date';
        case 'string':
            if (fieldName === 'email') return 'email';
            return 'text';
        case 'json':
        case 'object':
            return 'json';
        case 'string[]':
        case 'array':
            return 'json' // Payload doesn't have native string array, use JSON
            ;
        default:
            return 'text';
    }
}
function extractRelationTarget(fieldName, usePlural) {
    const base = fieldName.replace(/(_id|Id)$/, '');
    return usePlural ? pluralize(base) : base;
}
function generateCollection(modelKey, table, usePlural, adminGroup, customAccess, configureSaveToJWT = true) {
    // Use modelName from schema if set, otherwise apply pluralization to modelKey
    const baseName = table.modelName ?? modelKey;
    const slug = usePlural ? pluralize(baseName) : baseName;
    const fields = [];
    for (const [fieldKey, fieldDef] of Object.entries(table.fields)){
        if ([
            'id',
            'createdAt',
            'updatedAt'
        ].includes(fieldKey)) {
            continue;
        }
        const fieldName = fieldDef.fieldName ?? fieldKey;
        const hasReferences = fieldDef.references !== undefined;
        const fieldType = mapFieldType(fieldDef.type, fieldKey, hasReferences);
        if (fieldType === 'relationship') {
            // Use schema reference if available, otherwise infer from field name
            let relationTo;
            if (fieldDef.references?.model) {
                relationTo = usePlural ? pluralize(fieldDef.references.model) : fieldDef.references.model;
            } else {
                relationTo = extractRelationTarget(fieldKey, usePlural);
            }
            const relFieldName = fieldName.replace(/(_id|Id)$/, '');
            const saveToJWT = configureSaveToJWT ? getSaveToJWT(modelKey, relFieldName) : undefined;
            fields.push({
                name: relFieldName,
                type: 'relationship',
                relationTo,
                required: fieldDef.required ?? false,
                index: true,
                ...saveToJWT !== undefined && {
                    saveToJWT
                }
            });
            continue;
        }
        const saveToJWT = configureSaveToJWT ? getSaveToJWT(modelKey, fieldName) : undefined;
        const field = {
            name: fieldName,
            type: fieldType,
            ...saveToJWT !== undefined && {
                saveToJWT
            }
        };
        if (fieldDef.required) field.required = true;
        if (fieldDef.unique) {
            field.unique = true;
            field.index = true;
        }
        if (fieldDef.defaultValue !== undefined) {
            let defaultValue = fieldDef.defaultValue;
            if (typeof defaultValue === 'function') {
                try {
                    defaultValue = defaultValue();
                } catch  {
                    defaultValue = undefined;
                }
            }
            if (defaultValue !== undefined && defaultValue !== null) {
                field.defaultValue = defaultValue;
            }
        }
        fields.push(field);
    }
    const titleField = [
        'name',
        'email',
        'title',
        'identifier'
    ].find((f)=>fields.some((field)=>'name' in field && field.name === f));
    // Default access: admin-only read/delete, disabled manual create/update via admin UI
    // The adapter uses overrideAccess: true for programmatic operations from Better Auth
    const defaultAccess = {
        read: isAdmin(),
        create: ()=>false,
        update: ()=>false,
        delete: isAdmin()
    };
    return {
        slug,
        admin: {
            useAsTitle: titleField ?? 'id',
            group: adminGroup,
            description: `Auto-generated from Better Auth schema (${modelKey})`
        },
        access: customAccess ?? defaultAccess,
        fields,
        timestamps: true
    };
}
/**
 * Get existing field names from a collection, handling nested field structures.
 */ function getExistingFieldNames(fields) {
    const names = new Set();
    for (const field of fields){
        if ('name' in field && field.name) {
            names.add(field.name);
        }
    }
    return names;
}
/**
 * Augment an existing collection with missing fields from Better Auth schema.
 * This ensures user-defined collections (like 'users') get plugin fields automatically.
 */ function augmentCollectionWithMissingFields(collection, table, usePlural, modelKey, configureSaveToJWT = true) {
    const existingFieldNames = getExistingFieldNames(collection.fields);
    const missingFields = [];
    for (const [fieldKey, fieldDef] of Object.entries(table.fields)){
        // Skip standard fields that Payload handles
        if ([
            'id',
            'createdAt',
            'updatedAt'
        ].includes(fieldKey)) {
            continue;
        }
        const fieldName = fieldDef.fieldName ?? fieldKey;
        const hasReferences = fieldDef.references !== undefined;
        // For reference fields, check the name without Id suffix
        const payloadFieldName = hasReferences ? fieldName.replace(/(_id|Id)$/, '') : fieldName;
        // Skip if field already exists
        if (existingFieldNames.has(payloadFieldName)) {
            continue;
        }
        // Generate the missing field
        const fieldType = mapFieldType(fieldDef.type, fieldKey, hasReferences);
        if (fieldType === 'relationship') {
            let relationTo;
            if (fieldDef.references?.model) {
                relationTo = usePlural ? pluralize(fieldDef.references.model) : fieldDef.references.model;
            } else {
                relationTo = extractRelationTarget(fieldKey, usePlural);
            }
            const saveToJWT = configureSaveToJWT ? getSaveToJWT(modelKey, payloadFieldName) : undefined;
            missingFields.push({
                name: payloadFieldName,
                type: 'relationship',
                relationTo,
                required: fieldDef.required ?? false,
                index: true,
                admin: {
                    description: `Auto-added by Better Auth (${fieldKey})`
                },
                ...saveToJWT !== undefined && {
                    saveToJWT
                }
            });
        } else {
            const saveToJWT = configureSaveToJWT ? getSaveToJWT(modelKey, payloadFieldName) : undefined;
            const field = {
                name: payloadFieldName,
                type: fieldType,
                admin: {
                    description: `Auto-added by Better Auth (${fieldKey})`
                },
                ...saveToJWT !== undefined && {
                    saveToJWT
                }
            };
            if (fieldDef.required) field.required = true;
            if (fieldDef.unique) {
                field.unique = true;
                field.index = true;
            }
            if (fieldDef.defaultValue !== undefined) {
                let defaultValue = fieldDef.defaultValue;
                if (typeof defaultValue === 'function') {
                    try {
                        defaultValue = defaultValue();
                    } catch  {
                        defaultValue = undefined;
                    }
                }
                if (defaultValue !== undefined && defaultValue !== null) {
                    field.defaultValue = defaultValue;
                }
            }
            missingFields.push(field);
        }
    }
    // Return original if no fields to add
    if (missingFields.length === 0) {
        return collection;
    }
    // Return augmented collection
    return {
        ...collection,
        fields: [
            ...collection.fields,
            ...missingFields
        ]
    };
}
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
 */ export function betterAuthCollections(options = {}) {
    const { betterAuthOptions = {}, skipCollections = [
        'user'
    ], adminGroup = 'Auth', access, usePlural = true, configureSaveToJWT = true, firstUserAdmin, customizeCollection } = options;
    // Parse firstUserAdmin option (defaults to true)
    const firstUserAdminOptions = firstUserAdmin === false ? null : typeof firstUserAdmin === 'object' ? firstUserAdmin : {} // true or undefined = enabled with defaults
    ;
    return (incomingConfig)=>{
        const existingCollections = new Map((incomingConfig.collections ?? []).map((c)=>[
                c.slug,
                c
            ]));
        const tables = getAuthTables(betterAuthOptions);
        const generatedCollections = [];
        const augmentedCollections = [];
        // Calculate users collection slug for firstUserAdmin hook
        const userTable = tables['user'];
        const usersSlug = usePlural ? pluralize(userTable?.modelName ?? 'user') : userTable?.modelName ?? 'user';
        for (const [modelKey, table] of Object.entries(tables)){
            // Calculate slug
            const baseName = table.modelName ?? modelKey;
            const slug = usePlural ? pluralize(baseName) : baseName;
            // Check if this collection already exists
            const existingCollection = existingCollections.get(slug);
            if (existingCollection) {
                // Augment existing collection with missing fields from Better Auth schema
                let augmented = augmentCollectionWithMissingFields(existingCollection, table, usePlural, modelKey, configureSaveToJWT);
                // Inject first-user-admin hook for user collection
                if (modelKey === 'user' && firstUserAdminOptions) {
                    augmented = injectFirstUserAdminHook(augmented, firstUserAdminOptions, usersSlug);
                }
                if (augmented !== existingCollection) {
                    augmentedCollections.push(augmented);
                    existingCollections.set(slug, augmented);
                }
                continue;
            }
            // Skip if explicitly told to (but still augment if exists above)
            if (skipCollections.includes(modelKey)) {
                continue;
            }
            let collection = generateCollection(modelKey, table, usePlural, adminGroup, access, configureSaveToJWT);
            // Inject first-user-admin hook for user collection
            if (modelKey === 'user' && firstUserAdminOptions) {
                collection = injectFirstUserAdminHook(collection, firstUserAdminOptions, usersSlug);
            }
            // Apply customization callback if provided
            if (customizeCollection) {
                collection = customizeCollection(modelKey, collection);
            }
            generatedCollections.push(collection);
        }
        // Merge: replace augmented collections, add new ones
        const finalCollections = (incomingConfig.collections ?? []).map((c)=>{
            const augmented = augmentedCollections.find((a)=>a.slug === c.slug);
            return augmented ?? c;
        });
        return {
            ...incomingConfig,
            collections: [
                ...finalCollections,
                ...generatedCollections
            ]
        };
    };
}
