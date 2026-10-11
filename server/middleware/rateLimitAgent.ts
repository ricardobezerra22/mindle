const LIMITS: Record<string, number> = {
  "/api/agent/voice-tasks/preview": 10,
  "/api/agent/voice-tasks/confirm": 30,
};
const WINDOW_MS = 60_000;

// ponytail: in-memory per-process; replace with Redis when scaling horizontally
const buckets = new Map<string, { count: number; resetAt: number }>();

export default defineEventHandler((event) => {
  const path = event.path.split("?")[0]!;
  const limit = LIMITS[path];
  if (limit === undefined) return;

  const userId = event.context.userId as string | undefined;
  if (!userId) return;

  const key = `${path}:${userId}`;
  const now = Date.now();

  // prune expired buckets on each rate-limited request
  for (const [k, v] of buckets) if (now >= v.resetAt) buckets.delete(k);

  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  if (bucket.count >= limit) {
    const retryIn = Math.ceil((bucket.resetAt - now) / 1000);
    throw createError({
      statusCode: 429,
      message: `Limite de chamadas atingido. Tente novamente em ${retryIn} segundos.`,
    });
  }

  bucket.count++;
});
