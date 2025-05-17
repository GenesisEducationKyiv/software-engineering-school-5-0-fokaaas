export default () => ({
  port: process.env.PORT && parseInt(process.env.PORT, 10),
  databaseUrl: process.env.DATABASE_URL,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    ttl: process.env.REDIS_TTL,
  }
});
