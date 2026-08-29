export interface Cookie {
  readonly domain?: string
  readonly expirationDate: number
  readonly httpOnly: boolean
  readonly name: string
  readonly path: string
  readonly sameSite: 'lax' | 'no_restriction' | 'strict' | 'unspecified'
  readonly secure: boolean
  readonly url: string
  readonly value: string
}
