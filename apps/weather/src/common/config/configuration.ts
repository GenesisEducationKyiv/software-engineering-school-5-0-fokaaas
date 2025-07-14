export default () => ({
  port: process.env.PORT,
  logPath: process.env.LOG_PATH,
  weatherApi: {
    key: process.env.WEATHER_API_KEY,
    url: process.env.WEATHER_API_URL,
  },
  visualCrossing: {
    key: process.env.VISUAL_CROSSING_KEY,
    url: process.env.VISUAL_CROSSING_URL,
    iconUrl: process.env.VISUAL_CROSSING_ICON_URL,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    ttl: process.env.REDIS_TTL,
  },
  metrics: {
    gatewayUrl: process.env.GATEWAY_URL,
  },
});
