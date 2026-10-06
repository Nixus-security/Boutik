type Bucket = { count: number; resetAt: number };

// En mémoire, par instance : suffit contre l'abus simple, pas un quota distribué.
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

// Dernière entrée de X-Forwarded-For = celle ajoutée par le proxy de confiance (les entrées
// précédentes sont falsifiables par le client). À ajuster si plusieurs proxys sont chaînés.
export function clientIp(req: Request): string {
  const parts = (req.headers.get("x-forwarded-for") ?? "").split(",");
  const last = parts[parts.length - 1]?.trim() || "unknown";
  return /^\d+\.\d+\.\d+\.\d+:\d+$/.test(last) ? last.replace(/:\d+$/, "") : last;
}
