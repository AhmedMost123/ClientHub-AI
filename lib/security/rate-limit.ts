const requests = new Map<
  string,
  {
    count: number;
    expires: number;
  }
>();

export function rateLimit(identifier: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();

  const current = requests.get(identifier);

  if (!current || current.expires < now) {
    requests.set(identifier, {
      count: 1,
      expires: now + windowMs,
    });

    return {
      success: true,
    };
  }

  if (current.count >= limit) {
    return {
      success: false,
      remaining: 0,
    };
  }

  current.count++;

  return {
    success: true,
    remaining: limit - current.count,
  };
}
