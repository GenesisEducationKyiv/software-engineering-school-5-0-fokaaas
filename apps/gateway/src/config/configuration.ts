export default () => ({
  port: process.env.PORT,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT && parseInt(process.env.REDIS_PORT),
  },
  weather: {
    host: process.env.WEATHER_HOST,
    port: process.env.WEATHER_PORT,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
  },
  subscription: {
    host: process.env.SUBSCRIPTION_HOST,
    port: process.env.SUBSCRIPTION_PORT,
  },
});
