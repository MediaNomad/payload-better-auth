/**
 * Payload CMS Adapter for Better Auth
 *
 * A clean adapter that bridges Better Auth to Payload collections.
 * Follows the same factory pattern as payload-auth for compatibility.
 *
 * @packageDocumentation
 */

import type { Adapter, BetterAuthOptions, Where } from 'better-auth'
import type { BasePayload, Where as PayloadWhere, CollectionSlug } from 'payload'

export type PayloadAdapterConfig = {
  /**
   * The Payload instance or a function that returns it.
   * Use a function for lazy initialization.
   */
  payloadClient: BasePayload | (() => Promise<BasePayload>)

  /**
   * Adapter configuration options
   */
  adapterConfig: {
    /**
     * Map Better Auth model names to Payload collection slugs.
     * Defaults: { user: 'users', session: 'sessions', account: 'accounts', verification: 'verifications' }
     */
    collections?: Record<string, string>

    /**
     * Enable debug logging for troubleshooting
     */
    enableDebugLogs?: boolean

    /**
     * ID type used by Payload
     * - 'number' for SERIAL/auto-increment (recommended - Payload default)
     * - 'text' for UUID (requires idType: 'uuid' in Payload's db adapter)
     */
    idType: 'number' | 'text'
  }
}

const DEFAULT_COLLECTIONS: Record<string, string> = {
  user: 'users',
  session: 'sessions',
  account: 'accounts',
  verification: 'verifications',
}

/**
 * Creates a Better Auth adapter that uses Payload CMS as the database.
 *
 * Returns a factory function that Better Auth calls with its options.
 * This matches the pattern used by other Better Auth adapters.
 *
 * @example
 * ```ts
 * import { payloadAdapter } from '@delmare/payload-better-auth/adapter'
 *
 * const auth = betterAuth({
 *   database: payloadAdapter({
 *     payloadClient: payload,
 *     adapterConfig: {
 *       idType: 'number', // Use Payload's default SERIAL IDs
 *       collections: { user: 'users' },
 *     },
 *   }),
 *   // Required when using serial/integer IDs
 *   advanced: {
 *     database: {
 *       generateId: 'serial',
 *     },
 *   },
 * })
 * ```
 */
export function payloadAdapter({
  payloadClient,
  adapterConfig,
}: PayloadAdapterConfig): (options: BetterAuthOptions) => Adapter {
  const { collections = {}, enableDebugLogs = false, idType } = adapterConfig
  const finalCollections = { ...DEFAULT_COLLECTIONS, ...collections }

  const log = (...args: unknown[]) => {
    if (enableDebugLogs) console.log('[payload-adapter]', ...args)
  }

  async function resolvePayloadClient(): Promise<BasePayload> {
    return typeof payloadClient === 'function'
      ? await payloadClient()
      : payloadClient
  }

  function getCollection(model: string): CollectionSlug {
    return (finalCollections[model] ?? model) as CollectionSlug
  }

  /**
   * Transform field name for where clause (Better Auth → Payload)
   * Converts relationship fields like `userId` to `user`
   */
  function transformFieldName(fieldName: string): string {
    if (
      fieldName.endsWith('Id') &&
      fieldName !== 'id' &&
      fieldName !== 'accountId' &&
      fieldName !== 'providerId'
    ) {
      return fieldName.slice(0, -2)
    }
    return fieldName
  }

  /**
   * Convert Better Auth where clause to Payload where clause
   */
  function convertWhere(where?: Where[]): PayloadWhere {
    if (!where || where.length === 0) return {}

    if (where.length === 1) {
      const w = where[0]
      return {
        [transformFieldName(w.field)]: convertOperator(w.operator, w.value),
      }
    }

    const andConditions = where.filter((w) => w.connector !== 'OR')
    const orConditions = where.filter((w) => w.connector === 'OR')

    const result: PayloadWhere = {}

    if (andConditions.length > 0) {
      result.and = andConditions.map((w) => ({
        [transformFieldName(w.field)]: convertOperator(w.operator, w.value),
      }))
    }

    if (orConditions.length > 0) {
      result.or = orConditions.map((w) => ({
        [transformFieldName(w.field)]: convertOperator(w.operator, w.value),
      }))
    }

    return result
  }

  function convertOperator(
    operator: string | undefined,
    value: unknown
  ): Record<string, unknown> {
    switch (operator) {
      case 'eq':
        return { equals: value }
      case 'ne':
        return { not_equals: value }
      case 'gt':
        return { greater_than: value }
      case 'gte':
        return { greater_than_equal: value }
      case 'lt':
        return { less_than: value }
      case 'lte':
        return { less_than_equal: value }
      case 'in':
        return { in: value }
      case 'contains':
        return { contains: value }
      case 'starts_with':
        return { like: `${value}%` }
      case 'ends_with':
        return { like: `%${value}` }
      default:
        return { equals: value }
    }
  }

  function extractSingleId(where: PayloadWhere): string | number | null {
    if ('and' in where || 'or' in where) return null

    const idCondition = where.id
    if (
      idCondition &&
      typeof idCondition === 'object' &&
      'equals' in idCondition
    ) {
      const value = idCondition.equals
      if (typeof value === 'string' || typeof value === 'number') {
        return value
      }
    }

    return null
  }

  /**
   * Transform input data (Better Auth → Payload field names)
   * Also converts relationship IDs to the correct type based on idType
   */
  function transformInput(
    data: Record<string, unknown>
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(data)) {
      if (
        key.endsWith('Id') &&
        key !== 'id' &&
        key !== 'accountId' &&
        key !== 'providerId'
      ) {
        // Transform userId -> user and convert to correct ID type for relationships
        const fieldName = key.slice(0, -2)
        if (idType === 'number' && typeof value === 'string') {
          const num = parseInt(value, 10)
          result[fieldName] = isNaN(num) ? value : num
        } else {
          result[fieldName] = value
        }
      } else {
        result[key] = value
      }
    }

    return result
  }

  /**
   * Transform output data (Payload → Better Auth field names)
   */
  function transformOutput<T>(doc: T): T {
    if (!doc || typeof doc !== 'object') return doc

    const result = { ...doc } as Record<string, unknown>

    if ('id' in result && result.id !== undefined) {
      result.id = String(result.id)
    }

    for (const [key, value] of Object.entries(result)) {
      if (value && typeof value === 'object' && 'id' in value) {
        result[`${key}Id`] = String((value as { id: unknown }).id)
        delete result[key]
      } else if (
        typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
      ) {
        result[key] = new Date(value)
      }
    }

    return result as T
  }

  function convertId(id: string | number): string | number {
    if (idType === 'number' && typeof id === 'string') {
      const num = parseInt(id, 10)
      return isNaN(num) ? id : num
    }
    if (idType === 'text' && typeof id === 'number') {
      return String(id)
    }
    return id
  }

  /**
   * Handle join requests - fetch related data
   */
  async function handleJoins(
    payload: BasePayload,
    doc: Record<string, unknown>,
    model: string,
    join: Record<string, boolean | { limit?: number }>
  ): Promise<Record<string, unknown>> {
    const result = { ...doc }

    for (const [joinKey, joinConfig] of Object.entries(join)) {
      if (!joinConfig) continue

      const limit = typeof joinConfig === 'object' ? joinConfig.limit : undefined

      log('handleJoins', { model, joinKey, docId: doc.id })

      if (model === 'user' && joinKey === 'account') {
        const accounts = await payload.find({
          collection: getCollection('account'),
          where: { user: { equals: doc.id } },
          limit: limit ?? 100,
          depth: 0,
        })
        result[joinKey] = accounts.docs.map((a) => transformOutput(a))
      } else if (model === 'session' && joinKey === 'user') {
        const userId = doc.userId as string
        if (userId) {
          try {
            const user = await payload.findByID({
              collection: getCollection('user'),
              id: userId,
              depth: 0,
            })
            result[joinKey] = transformOutput(user)
          } catch {
            result[joinKey] = null
          }
        }
      } else if (model === 'account' && joinKey === 'user') {
        const userId = doc.userId as string
        if (userId) {
          try {
            const user = await payload.findByID({
              collection: getCollection('user'),
              id: userId,
              depth: 0,
            })
            result[joinKey] = transformOutput(user)
          } catch {
            result[joinKey] = null
          }
        }
      }
      // Extensibility: Add more join patterns here for plugins
    }

    return result
  }

  return (_options: BetterAuthOptions): Adapter => {
    log('Adapter initialized', { collections: finalCollections })

    return {
      id: 'payload-adapter',

      async create<T extends Record<string, unknown>, R = T>({
        model,
        data,
      }: {
        model: string
        data: Omit<T, 'id'>
        select?: string[]
        forceAllowId?: boolean
      }): Promise<R> {
        const payload = await resolvePayloadClient()
        const collection = getCollection(model)
        const transformedData = transformInput(data as Record<string, unknown>)

        log('create', { collection, data: transformedData })

        try {
          const result = await payload.create({
            collection,
            data: transformedData,
            depth: 0,
          })
          return transformOutput(result) as R
        } catch (error) {
          console.error('[payload-adapter] create failed:', {
            collection,
            model,
            error: error instanceof Error ? error.message : error,
          })
          throw error
        }
      },

      async findOne<T>({
        model,
        where,
        select: _select,
        join,
      }: {
        model: string
        where: Where[]
        select?: string[]
        join?: Record<string, boolean | { limit?: number }>
      }): Promise<T | null> {
        try {
          const payload = await resolvePayloadClient()
          const collection = getCollection(model)
          const payloadWhere = convertWhere(where)

          const id = extractSingleId(payloadWhere)
          if (id) {
            try {
              const result = await payload.findByID({
                collection,
                id: convertId(id),
                depth: 1,
              })
              let doc = transformOutput(result) as unknown as Record<
                string,
                unknown
              >
              if (join) {
                doc = await handleJoins(payload, doc, model, join)
              }
              return doc as unknown as T
            } catch (error) {
              if (
                error instanceof Error &&
                'status' in error &&
                (error as Error & { status: number }).status === 404
              ) {
                return null
              }
              throw error
            }
          }

          const result = await payload.find({
            collection,
            where: payloadWhere,
            limit: 1,
            depth: 1,
          })

          let doc: Record<string, unknown> | null = result.docs[0]
            ? (transformOutput(result.docs[0]) as unknown as Record<
                string,
                unknown
              >)
            : null

          if (doc && join) {
            doc = await handleJoins(payload, doc, model, join)
          }

          return doc as unknown as T | null
        } catch (error) {
          console.error('[payload-adapter] findOne FAILED', {
            model,
            where,
            error,
          })
          throw error
        }
      },

      async findMany<T>({
        model,
        where,
        limit,
        offset,
        sortBy,
      }: {
        model: string
        where?: Where[]
        limit?: number
        sortBy?: { field: string; direction: 'asc' | 'desc' }
        offset?: number
        join?: Record<string, boolean | { limit?: number }>
      }): Promise<T[]> {
        const payload = await resolvePayloadClient()
        const collection = getCollection(model)
        const payloadWhere = convertWhere(where)

        const result = await payload.find({
          collection,
          where: payloadWhere,
          limit: limit ?? 100,
          page: offset ? Math.floor(offset / (limit ?? 100)) + 1 : 1,
          sort: sortBy
            ? `${sortBy.direction === 'desc' ? '-' : ''}${sortBy.field}`
            : undefined,
          depth: 1,
        })

        return result.docs.map((doc) => transformOutput(doc)) as T[]
      },

      async update<T>({
        model,
        where,
        update: data,
      }: {
        model: string
        where: Where[]
        update: Record<string, unknown>
      }): Promise<T | null> {
        const payload = await resolvePayloadClient()
        const collection = getCollection(model)
        const payloadWhere = convertWhere(where)
        const transformedData = transformInput(data)

        const id = extractSingleId(payloadWhere)
        if (id) {
          const result = await payload.update({
            collection,
            id: convertId(id),
            data: transformedData,
            depth: 1,
          })
          return transformOutput(result) as T
        }

        const result = await payload.update({
          collection,
          where: payloadWhere,
          data: transformedData,
          depth: 1,
        })

        return result.docs[0] ? (transformOutput(result.docs[0]) as T) : null
      },

      async updateMany({
        model,
        where,
        update: data,
      }: {
        model: string
        where: Where[]
        update: Record<string, unknown>
      }): Promise<number> {
        const payload = await resolvePayloadClient()
        const collection = getCollection(model)
        const payloadWhere = convertWhere(where)
        const transformedData = transformInput(data)

        const result = await payload.update({
          collection,
          where: payloadWhere,
          data: transformedData,
          depth: 0,
        })

        return result.docs.length
      },

      async delete({ model, where }: { model: string; where: Where[] }): Promise<void> {
        const payload = await resolvePayloadClient()
        const collection = getCollection(model)
        const payloadWhere = convertWhere(where)

        const id = extractSingleId(payloadWhere)
        if (id) {
          await payload.delete({ collection, id: convertId(id) })
          return
        }

        await payload.delete({ collection, where: payloadWhere })
      },

      async deleteMany({
        model,
        where,
      }: {
        model: string
        where: Where[]
      }): Promise<number> {
        const payload = await resolvePayloadClient()
        const collection = getCollection(model)
        const payloadWhere = convertWhere(where)

        const result = await payload.delete({
          collection,
          where: payloadWhere,
        })

        return result.docs.length
      },

      async count({
        model,
        where,
      }: {
        model: string
        where?: Where[]
      }): Promise<number> {
        const payload = await resolvePayloadClient()
        const collection = getCollection(model)
        const payloadWhere = convertWhere(where)

        const result = await payload.count({
          collection,
          where: payloadWhere,
        })

        return result.totalDocs
      },

      async transaction(callback) {
        return callback(this)
      },
    }
  }
}

export type { Adapter, BetterAuthOptions }
