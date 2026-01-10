/**
 * Simple In-Memory Cache
 * For production, consider using Redis or similar
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const cache = new Map<string, CacheEntry<any>>()

export function setCache<T>(key: string, data: T, ttlSeconds: number = 300): void {
  const expiresAt = Date.now() + ttlSeconds * 1000
  cache.set(key, { data, expiresAt })
}

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) {
    return null
  }

  if (entry.expiresAt < Date.now()) {
    cache.delete(key)
    return null
  }

  return entry.data as T
}

export function deleteCache(key: string): void {
  cache.delete(key)
}

export function clearCache(): void {
  cache.clear()
}

// Cleanup expired entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    cache.forEach((entry, key) => {
      if (entry.expiresAt < now) {
        cache.delete(key)
      }
    })
  }, 60000) // Clean up every minute
}

