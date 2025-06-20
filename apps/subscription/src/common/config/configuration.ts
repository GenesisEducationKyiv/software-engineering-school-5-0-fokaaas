export default () => ({
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    ttl: process.env.REDIS_TTL,
  },
});
