/**
 * Performance Monitoring Utilities
 */

export function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  return fn().finally(() => {
    const duration = performance.now() - start
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    }
    // In production, send to monitoring service
  })
}

export function logSlowQuery(query: string, duration: number, threshold: number = 1000): void {
  if (duration > threshold) {
    console.warn(`[Slow Query] ${query} took ${duration}ms`)
    // In production, send to monitoring service
  }
}

