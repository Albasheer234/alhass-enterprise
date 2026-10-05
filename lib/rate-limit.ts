// Simple in-memory rate limiter for login attempts.
// Suitable for a single-instance deployment (SQLite V1).
// For multi-instance deployments, replace with a shared store (e.g. Redis).

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

// Periodically clear expired buckets to avoid unbounded growth
setInterval(() => {
  const now = Date.now();
  buckets.forEach((v, k) => {
    if (now > v.resetAt) buckets.delete(k);
  });
}, 60_000).unref();
