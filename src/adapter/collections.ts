/**
 * Auto-generate Payload collections from Better Auth schema
 *
 * @packageDocumentation
 */

import type { Config, CollectionConfig, Field, Plugin } from 'payload'
import type { BetterAuthOptions } from 'better-auth'
import { getAuthTables } from 'better-auth/db'

export type BetterAuthCollectionsOptions = {
  /**
   * Better Auth options. Pass the same options you use for betterAuth().
   * The plugin reads the schema to generate collections.
   */
  betterAuthOptions?: BetterAuthOptions

  /**
   * Override collection slugs (e.g., { user: 'users', session: 'sessions' })
   */
  slugOverrides?: Record<string, string>

  /**
   * Collections to skip (they already exist in your config)
   * Default: ['user'] - assumes you have a Users collection
   */
  skipCollections?: string[]

  /**
   * Admin group name for generated collections
   * Default: 'Auth'
   */
  adminGroup?: string

  /**
   * Custom access control for generated collections.
   * By default, only admins can read/delete, and create/update are disabled.
   */
  access?: CollectionConfig['access']
}

const DEFAULT_SLUG_OVERRIDES: Record<string, string> = {
  user: 'users',
  session: 'sessions',
  account: 'accounts',
  verification: 'verifications',
}

function mapFieldType(
  type: string,
  fieldName: string,
  hasReferences: boolean
): Field['type'] {
  if (hasReferences) {
    return 'relationship'
  }

  switch (type) {
    case 'boolean':
      return 'checkbox'
    case 'number':
      return 'number'
    case 'date':
      return 'date'
    case 'string':
      if (fieldName === 'email') return 'email'
      return 'text'
    default:
      return 'text'
  }
}

function extractRelationTarget(
  fieldName: string,
  slugOverrides: Record<string, string>
): string {
  const base = fieldName.replace(/(_id|Id)$/, '')
  const pluralized = base.endsWith('s') ? base : `${base}s`
  return slugOverrides[base] ?? slugOverrides[pluralized] ?? pluralized
}

function generateCollection(
  modelKey: string,
  table: ReturnType<typeof getAuthTables>[string],
  slugOverrides: Record<string, string>,
  adminGroup: string,
  customAccess?: BetterAuthCollectionsOptions['access']
): CollectionConfig {
  const slug = slugOverrides[modelKey] ?? table.modelName ?? modelKey
  const fields: Field[] = []

  for (const [fieldKey, fieldDef] of Object.entries(table.fields)) {
    if (['id', 'createdAt', 'updatedAt'].includes(fieldKey)) {
      continue
    }

    const fieldName = fieldDef.fieldName ?? fieldKey
    const hasReferences = fieldDef.references !== undefined
    const fieldType = mapFieldType(fieldDef.type as string, fieldKey, hasReferences)

    if (fieldType === 'relationship') {
      const relationTo = fieldDef.references?.model
        ? slugOverrides[fieldDef.references.model] ?? fieldDef.references.model
        : extractRelationTarget(fieldKey, slugOverrides)

      fields.push({
        name: fieldName.replace(/(_id|Id)$/, ''),
        type: 'relationship',
        relationTo,
        required: fieldDef.required ?? false,
        index: true,
      } as Field)
      continue
    }

    const field: Record<string, unknown> = {
      name: fieldName,
      type: fieldType,
    }

    if (fieldDef.required) field.required = true
    if (fieldDef.unique) {
      field.unique = true
      field.index = true
    }

    if (fieldDef.defaultValue !== undefined) {
      let defaultValue: unknown = fieldDef.defaultValue
      if (typeof defaultValue === 'function') {
        try {
          defaultValue = (defaultValue as () => unknown)()
        } catch {
          defaultValue = undefined
        }
      }
      if (defaultValue !== undefined && defaultValue !== null) {
        field.defaultValue = defaultValue
      }
    }

    fields.push(field as Field)
  }

  const titleField = ['name', 'email', 'title', 'identifier'].find((f) =>
    fields.some((field) => 'name' in field && field.name === f)
  )

  // Default access: admin-only read/delete, disabled create/update
  const defaultAccess: CollectionConfig['access'] = {
    read: ({ req }) => (req.user as { role?: string } | undefined)?.role === 'admin',
    create: () => false,
    update: () => false,
    delete: ({ req }) => (req.user as { role?: string } | undefined)?.role === 'admin',
  }

  return {
    slug,
    admin: {
      useAsTitle: titleField ?? 'id',
      group: adminGroup,
      description: `Auto-generated from Better Auth schema (${modelKey})`,
    },
    access: customAccess ?? defaultAccess,
    fields,
    timestamps: true,
  }
}

/**
 * Payload plugin that auto-generates collections from Better Auth schema.
 *
 * @example
 * ```ts
 * import { betterAuthCollections } from '@delmare/payload-better-auth'
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
 */
export function betterAuthCollections(
  options: BetterAuthCollectionsOptions = {}
): Plugin {
  const {
    betterAuthOptions = {},
    slugOverrides = {},
    skipCollections = ['user'],
    adminGroup = 'Auth',
    access,
  } = options

  const finalSlugOverrides = { ...DEFAULT_SLUG_OVERRIDES, ...slugOverrides }

  return (incomingConfig: Config): Config => {
    const existingCollectionSlugs = new Set(
      (incomingConfig.collections ?? []).map((c) => c.slug)
    )

    const tables = getAuthTables(betterAuthOptions)
    const generatedCollections: CollectionConfig[] = []

    for (const [modelKey, table] of Object.entries(tables)) {
      if (skipCollections.includes(modelKey)) {
        continue
      }

      const slug = finalSlugOverrides[modelKey] ?? table.modelName ?? modelKey

      if (existingCollectionSlugs.has(slug)) {
        continue
      }

      const collection = generateCollection(
        modelKey,
        table,
        finalSlugOverrides,
        adminGroup,
        access
      )

      generatedCollections.push(collection)
    }


    return {
      ...incomingConfig,
      collections: [
        ...(incomingConfig.collections ?? []),
        ...generatedCollections,
      ],
    }
  }
}
