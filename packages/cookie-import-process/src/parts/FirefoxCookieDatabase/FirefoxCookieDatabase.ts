/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { DatabaseSync } from 'node:sqlite'

export interface FirefoxCookieRow {
  readonly expiry: number
  readonly host: string
  readonly isHttpOnly: number
  readonly isSecure: number
  readonly name: string
  readonly originAttributes: string
  readonly path: string
  readonly sameSite: number
  readonly value: string
}

const getDatabaseError = (error: unknown): Error => {
  const message = error instanceof Error ? error.message : String(error)
  if (message.toLowerCase().includes('locked') || message.toLowerCase().includes('busy')) {
    return new Error('Firefox cookie database is busy. Close Firefox and try again.')
  }
  return new Error('Failed to read the Firefox cookie database')
}

const withDatabase = <T>(path: string, fn: (database: DatabaseSync) => T): T => {
  let database: DatabaseSync | undefined
  try {
    database = new DatabaseSync(path, { readOnly: true })
    database.exec('PRAGMA busy_timeout = 1000')
    return fn(database)
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Unsupported Firefox cookie database version')) {
      throw error
    }
    throw getDatabaseError(error)
  } finally {
    database?.close()
  }
}

const getVersion = (database: DatabaseSync): number => {
  const row = database.prepare('PRAGMA user_version').get() as { readonly user_version: number }
  if (row.user_version < 9) {
    throw new Error(`Unsupported Firefox cookie database version ${row.user_version}`)
  }
  return row.user_version
}

export const readCookies = (path: string): readonly FirefoxCookieRow[] => {
  return withDatabase(path, (database) => {
    getVersion(database)
    return database
      .prepare(
        `
        SELECT
          expiry,
          host,
          isHttpOnly,
          isSecure,
          name,
          originAttributes,
          path,
          sameSite,
          value
        FROM moz_cookies
      `,
      )
      .all() as unknown as readonly FirefoxCookieRow[]
  })
}
