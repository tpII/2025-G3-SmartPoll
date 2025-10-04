import { createClient } from 'redis';

const redis = new createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  }
});

redis.on("error", (err) => console.error("Redis Client Error", err));

await redis.connect();


const setVoterTav = async (tav, signature, ttl) => {
  await redis.set(`voter:${tav}`, JSON.stringify({ signature }), {
    EX: ttl,
  });
};

const getVoterTav = async (tav) => {
  const data = await redis.get(`voter:${tav}`);
  return data ? JSON.parse(data) : null;
};

export { redis, setVoterTav, getVoterTav };