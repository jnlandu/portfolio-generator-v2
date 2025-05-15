import { LRUCache } from 'lru-cache';

const rateLimit = {
  tokenCache: new LRUCache<string, number>({
    max: 500,
    ttl: 60 * 1000, // 1 minute
  }),
  
  check: async (ip: string) => {
    const limit = 5; // 5 requests per minute
    const current = rateLimit.tokenCache.get(ip) || 0;
    
    if (current >= limit) {
      return { success: false, limit, remaining: 0 };
    }
    
    rateLimit.tokenCache.set(ip, current + 1);
    return { success: true, limit, remaining: limit - current - 1 };
  }
};

export { rateLimit };