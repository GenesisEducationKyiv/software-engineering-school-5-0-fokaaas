export default () => ({
  port: process.env.PORT,
  weather: {
    host: process.env.WEATHER_HOST,
    port: process.env.WEATHER_PORT,
  },
  subscription: {
    host: process.env.SUBSCRIPTION_HOST,
    port: process.env.SUBSCRIPTION_PORT,
  },
  rmq: {
    host: process.env.RMQ_HOST,
    port: process.env.RMQ_PORT,
  },
});
