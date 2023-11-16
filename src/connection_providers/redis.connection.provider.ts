import Redis from 'ioredis';

const redisConfig = {
  host: process.env.REDIS_URI || 'redis',
  port: 6379,
};

const redisClient = new Redis(redisConfig);

export default redisClient;
