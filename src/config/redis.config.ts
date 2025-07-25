import { createClient } from "redis";
import { config } from "dotenv";

config({ path: "./env" });

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Connected to Redis");
    }
  } catch (error) {
    console.log("Error connecting to Redis:", error);
  }
};

export default redisClient;
