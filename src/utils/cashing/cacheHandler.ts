import redisClient from "../../config/redis.config";

export const cacheHandler = {
  get: async (key: string) => {
    const cachedData = await redisClient.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  },
  set: async (key: string, data: any, ttl: number = 60) => {
    await redisClient.set(key, JSON.stringify(data), {
      EX: ttl,
    });
  },

  del: async (key: string) => {
    await redisClient.del(key);
  },
};
